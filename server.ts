import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will fallback to client-side mocks.");
}

// In-memory Database for CMS Leads and analytics state
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed";
  date: string;
  value?: number;
}

const leads: Lead[] = [
  { id: "1", name: "Sofía Rodríguez", email: "sofia@acme.com", company: "Acme Corp", source: "Landing Form", status: "new", date: "2026-07-25T14:32:00Z", value: 1200 },
  { id: "2", name: "Mateo Silva", email: "mateo@silva.io", company: "Silva Consulting", source: "Onboarding Quiz", status: "qualified", date: "2026-07-24T09:15:00Z", value: 3500 },
  { id: "3", name: "Lucía Fernández", email: "lfernandez@techflow.net", company: "TechFlow Ltd", source: "Landing Form", status: "contacted", date: "2026-07-23T18:45:00Z", value: 800 },
  { id: "4", name: "Diego Torres", email: "diego@growthlabs.co", company: "GrowthLabs", source: "Onboarding Quiz", status: "closed", date: "2026-07-21T11:20:00Z", value: 5000 },
];

// Database client configuration using 'pg'
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
let pool: pg.Pool | null = null;

if (dbUrl) {
  // Use SSL for hosted cloud databases (like Vercel Postgres, Supabase, Neon) unless running on localhost
  const useSsl = !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1");
  pool = new pg.Pool({
    connectionString: dbUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });
  console.log("[SmartWeb Database] Initializing PostgreSQL connection pool...");
} else {
  console.log("[SmartWeb Database] No database connection URL found. Operating with temporary in-memory storage.");
}

// Automatically bootstrap database schema on startup if connected to PostgreSQL
async function initDb() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    try {
      // Create leads table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          company VARCHAR(255),
          source VARCHAR(255),
          status VARCHAR(50) DEFAULT 'new',
          date VARCHAR(255),
          value NUMERIC DEFAULT 0
        )
      `);
      console.log("[SmartWeb Database] PostgreSQL 'leads' table verified.");

      // If the table is empty, seed it with the default template records
      const countRes = await client.query("SELECT COUNT(*) FROM leads");
      const rowCount = parseInt(countRes.rows[0].count, 10);
      if (rowCount === 0) {
        console.log("[SmartWeb Database] Seeding initial template leads...");
        const defaultLeads = [
          { name: "Sofía Rodríguez", email: "sofia@acme.com", company: "Acme Corp", source: "Landing Form", status: "new", date: "2026-07-25T14:32:00Z", value: 1200 },
          { name: "Mateo Silva", email: "mateo@silva.io", company: "Silva Consulting", source: "Onboarding Quiz", status: "qualified", date: "2026-07-24T09:15:00Z", value: 3500 },
          { name: "Lucía Fernández", email: "lfernandez@techflow.net", company: "TechFlow Ltd", source: "Landing Form", status: "contacted", date: "2026-07-23T18:45:00Z", value: 800 },
          { name: "Diego Torres", email: "diego@growthlabs.co", company: "GrowthLabs", source: "Onboarding Quiz", status: "closed", date: "2026-07-21T11:20:00Z", value: 5000 },
        ];
        for (const item of defaultLeads) {
          await client.query(
            "INSERT INTO leads (name, email, company, source, status, date, value) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [item.name, item.email, item.company, item.source, item.status, item.date, item.value]
          );
        }
        console.log("[SmartWeb Database] Seeding completed successfully.");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[SmartWeb Database] Error during database initialization:", error);
  }
}

// Trigger async database migration/seeding check
initDb();

// Helper to secure AI calling
async function callGemini(prompt: string, responseSchema?: any) {
  if (!ai) {
    throw new Error("Gemini AI Client is not initialized (missing API key)");
  }
  
  const config: any = {
    temperature: 0.7,
  };

  if (responseSchema) {
    config.responseMimeType = "application/json";
    config.responseSchema = responseSchema;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config,
  });

  return response.text;
}

// --- REST API ENDPOINTS ---

// Get all leads
app.get("/api/leads", async (req: Request, res: Response) => {
  if (pool) {
    try {
      const result = await pool.query("SELECT * FROM leads ORDER BY id DESC");
      const dbLeads = result.rows.map((row: any) => ({
        id: String(row.id),
        name: row.name,
        email: row.email,
        company: row.company || "",
        source: row.source || "",
        status: row.status || "new",
        date: row.date || new Date().toISOString(),
        value: row.value ? Number(row.value) : 0
      }));
      res.json({ success: true, data: dbLeads });
    } catch (error: any) {
      console.error("[SmartWeb Database] Error fetching leads:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.json({ success: true, data: leads });
  }
});

// Create a lead (from Form or Quiz)
app.post("/api/leads", async (req: Request, res: Response) => {
  const { name, email, company, source, status, value } = req.body;
  if (!name || !email) {
    res.status(400).json({ success: false, error: "Name and Email are required." });
    return;
  }

  const companyVal = company || "Freelancer / Indiv";
  const sourceVal = source || "Formulario Web";
  const statusVal = status || "new";
  const dateVal = new Date().toISOString();
  const numValue = Number(value) || 0;

  if (pool) {
    try {
      const result = await pool.query(
        "INSERT INTO leads (name, email, company, source, status, date, value) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [name, email, companyVal, sourceVal, statusVal, dateVal, numValue]
      );
      const row = result.rows[0];
      const newLead = {
        id: String(row.id),
        name: row.name,
        email: row.email,
        company: row.company || "",
        source: row.source || "",
        status: row.status || "new",
        date: row.date || dateVal,
        value: row.value ? Number(row.value) : 0
      };
      res.json({ success: true, data: newLead });
    } catch (error: any) {
      console.error("[SmartWeb Database] Error creating lead:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    const newLead: Lead = {
      id: String(leads.length + 1),
      name,
      email,
      company: companyVal,
      source: sourceVal,
      status: statusVal as any,
      date: dateVal,
      value: numValue,
    };

    leads.unshift(newLead);
    res.json({ success: true, data: newLead });
  }
});

// AI Route: Generate Landing Page content based on industry & tone
app.post("/api/ai/generate", async (req: Request, res: Response) => {
  const { businessName, industry, targetAudience, tone } = req.body;
  
  if (!businessName || !industry) {
    res.status(400).json({ success: false, error: "Business name and industry are required." });
    return;
  }

  const prompt = `
    You are an expert copywriter and product designer. Generate high-converting copy for a B2B SaaS marketing landing page based on this information:
    - Company Name: ${businessName}
    - Industry/What they do: ${industry}
    - Target Audience: ${targetAudience || "SMEs and professionals"}
    - Tone of Voice: ${tone || "professional, innovative, trustworthy"}

    Your response must follow the JSON schema. All copy must be written in Spanish.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      hero: {
        type: Type.OBJECT,
        properties: {
          badge: { type: Type.STRING, description: "Small eye-catching tag, e.g., 'SaaS del Futuro' or 'Nueva Era'" },
          title: { type: Type.STRING, description: "Punchy, high-impact main headline (5-8 words)" },
          subtitle: { type: Type.STRING, description: "Clear sub-headline showing value proposition (12-20 words)" },
          ctaPrimary: { type: Type.STRING, description: "Text for the primary call-to-action button" },
          ctaSecondary: { type: Type.STRING, description: "Text for secondary button" }
        },
        required: ["badge", "title", "subtitle", "ctaPrimary", "ctaSecondary"]
      },
      benefits: {
        type: Type.ARRAY,
        description: "Exactly 3 clear benefits of using the product",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING, description: "Short title of the benefit" },
            description: { type: Type.STRING, description: "Short descriptive sentence" },
            icon: { type: Type.STRING, description: "Choose one of these lucide-react keys: Zap, Shield, Sparkles, BarChart, Target, Users" }
          },
          required: ["id", "title", "description", "icon"]
        }
      },
      faq: {
        type: Type.ARRAY,
        description: "Exactly 3 frequent questions & detailed answers",
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ["question", "answer"]
        }
      }
    },
    required: ["hero", "benefits", "faq"]
  };

  try {
    const text = await callGemini(prompt, schema);
    if (text) {
      res.json({ success: true, data: JSON.parse(text) });
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini Generate Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Route: Audit Landing Page SEO and content quality
app.post("/api/ai/seo-audit", async (req: Request, res: Response) => {
  const { seoKeywords, heroTitle, heroSubtitle, benefitsText, faqText } = req.body;

  const prompt = `
    Analyze the following Spanish marketing landing page content for SEO performance, clarity, and conversion rate optimization (CRO):
    - Target SEO Keywords: "${seoKeywords || 'not specified'}"
    - Hero Title: "${heroTitle}"
    - Hero Subtitle: "${heroSubtitle}"
    - Benefits: "${JSON.stringify(benefitsText)}"
    - FAQs: "${JSON.stringify(faqText)}"

    Grade the content out of 100 on:
    1. SEO Optimization (keyword density, metadata strength)
    2. Readability & Tone (is it compelling?)
    3. CRO Effectiveness (clear call-to-action, layout suggestions)

    Provide a JSON response following the requested schema in Spanish.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      seoScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
      readabilityScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
      croScore: { type: Type.INTEGER, description: "Score from 0 to 100" },
      summary: { type: Type.STRING, description: "A high-level diagnostic summary of the copy" },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 2-3 content strengths"
      },
      improvements: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of 3 concrete recommendations for SEO & conversion"
      },
      keywordAnalysis: {
        type: Type.STRING,
        description: "Brief analysis of how well keywords were integrated"
      }
    },
    required: ["seoScore", "readabilityScore", "croScore", "summary", "strengths", "improvements", "keywordAnalysis"]
  };

  try {
    const text = await callGemini(prompt, schema);
    if (text) {
      res.json({ success: true, data: JSON.parse(text) });
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini SEO Audit Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Route: Analyze leads data and suggest personalized growth recommendations
app.post("/api/ai/recommendations", async (req: Request, res: Response) => {
  const { visitorCount, conversionRate, activeLeadsCount } = req.body;

  const prompt = `
    You are an AI Growth hacker and SaaS Consultant.
    The user's SmartWeb landing page has the following performance metrics:
    - Visitors this week: ${visitorCount}
    - Conversion Rate: ${conversionRate}%
    - Active leads captured: ${activeLeadsCount}

    Review these numbers and provide 3 smart, actionable growth recommendations to double the conversion rate, run automated campaigns, or target new regions.
    The response must follow the JSON schema and be in Spanish.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, description: "Alta, Media, Baja" },
            impact: { type: Type.STRING, description: "Alto, Medio, Bajo" }
          },
          required: ["title", "description", "difficulty", "impact"]
        }
      }
    },
    required: ["recommendations"]
  };

  try {
    const text = await callGemini(prompt, schema);
    if (text) {
      res.json({ success: true, data: JSON.parse(text) });
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini recommendations error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SmartWeb Server] Running at http://localhost:${PORT}`);
    });
  }
}

if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
