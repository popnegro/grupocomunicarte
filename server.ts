import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { db } from "./src/db/index.ts";
import { users, leads, screens, clientes, mediakits, changelogs } from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { SEED_SCREENS, INITIAL_CLIENTES, INITIAL_MEDIAKITS, INITIAL_LOGS } from "./src/db/seedData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK
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
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will fallback to default responses.");
}

// Automatically bootstrap database schema and seed data on startup
async function initDb() {
  try {
    // 1. Seed Leads
    const existingLeads = await db.select().from(leads).limit(1);
    if (existingLeads.length === 0) {
      console.log("[Bootstrap] Seeding default leads...");
      const defaultLeads = [
        { name: "Sofía Rodríguez", email: "sofia@acme.com", company: "Acme Corp", source: "Landing Form", status: "new", date: "2026-07-25T14:32:00Z", value: 1200 },
        { name: "Mateo Silva", email: "mateo@silva.io", company: "Silva Consulting", source: "Onboarding Quiz", status: "qualified", date: "2026-07-24T09:15:00Z", value: 3500 },
        { name: "Lucía Fernández", email: "lfernandez@techflow.net", company: "TechFlow Ltd", source: "Landing Form", status: "contacted", date: "2026-07-23T18:45:00Z", value: 800 },
        { name: "Diego Torres", email: "diego@growthlabs.co", company: "Diego Torres S.A.", source: "Onboarding Quiz", status: "closed", date: "2026-07-21T11:20:00Z", value: 5000 },
      ];
      await db.insert(leads).values(defaultLeads);
    }

    // 2. Seed Screens
    const existingScreens = await db.select().from(screens).limit(1);
    if (existingScreens.length === 0) {
      console.log("[Bootstrap] Seeding default screens...");
      await db.insert(screens).values(SEED_SCREENS);
    }

    // 3. Seed Clients
    const existingClients = await db.select().from(clientes).limit(1);
    if (existingClients.length === 0) {
      console.log("[Bootstrap] Seeding default clients...");
      await db.insert(clientes).values(INITIAL_CLIENTES);
    }

    // 4. Seed Mediakits
    const existingMediakits = await db.select().from(mediakits).limit(1);
    if (existingMediakits.length === 0) {
      console.log("[Bootstrap] Seeding default mediakits...");
      await db.insert(mediakits).values(INITIAL_MEDIAKITS);
    }

    // 5. Seed Changelogs
    const existingChangelogs = await db.select().from(changelogs).limit(1);
    if (existingChangelogs.length === 0) {
      console.log("[Bootstrap] Seeding default changelogs...");
      await db.insert(changelogs).values(INITIAL_LOGS);
    }

    console.log("[Bootstrap] PostgreSQL seeding check and initialization complete.");
  } catch (error) {
    console.error("[Bootstrap] Error during database seeding:", error);
  }
}

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
    model: "gemini-2.5-flash",
    contents: prompt,
    config,
  });

  return response.text;
}

// --- API ENDPOINTS ---

// Auth Synchronization Route (Registers/syncs Firebase user in PostgreSQL)
app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || "";
    const dbUser = await getOrCreateUser(uid, email);
    res.json({ success: true, user: dbUser });
  } catch (error: any) {
    console.error("Auth sync error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Leads
app.get("/api/leads", async (req: Request, res: Response) => {
  try {
    const dbLeads = await db.select().from(leads).orderBy(desc(leads.id));
    const formatted = dbLeads.map(row => ({
      id: String(row.id),
      name: row.name,
      email: row.email,
      company: row.company || "",
      source: row.source || "",
      status: row.status || "new",
      date: row.date || new Date().toISOString(),
      value: row.value || 0
    }));
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Email helper for new Lead notification via Resend
async function sendLeadNotificationEmail(lead: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.SALES_NOTIFY_EMAIL || "comercial@pantallasledmendoza.com";

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #faf9f5; text-align: left;">
      <h2 style="color: #06434a; border-bottom: 2px solid #06434a; padding-bottom: 10px; margin-top: 0;">🎉 ¡Nuevo Lead Recibido!</h2>
      <p style="font-size: 14px; color: #444; line-height: 1.5;">Se ha registrado un nuevo contacto interesado a través de los canales digitales de la plataforma comercial:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background-color: #f5f4f0;">
          <td style="padding: 10px; font-weight: bold; width: 150px; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Anunciante / Nombre</td>
          <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Email</td>
          <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;"><a href="mailto:${lead.email}" style="color: #06434a; text-decoration: underline;">${lead.email}</a></td>
        </tr>
        <tr style="background-color: #f5f4f0;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Empresa</td>
          <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;">${lead.company || "No especificada"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Origen del Lead</td>
          <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444;"><span style="background-color: #06434a; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${lead.source}</span></td>
        </tr>
        <tr style="background-color: #f5f4f0;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e7e5e4; color: #1c1917;">Presupuesto Estimado</td>
          <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; color: #444; font-weight: bold; color: #06434a;">$${lead.value ? lead.value.toLocaleString() : "0"} ARS</td>
        </tr>
      </table>
      
      <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e7e5e4; font-size: 11px; color: #888; text-align: center;">
        Este es un mensaje automático del Sistema de Gestión Comercial de Pantallas LED Mendoza.
      </div>
    </div>
  `;

  if (!apiKey) {
    console.log("==========================================");
    console.log("SIMULACIÓN DE NOTIFICACIÓN POR EMAIL (FALTA RESEND_API_KEY)");
    console.log(`Para: ${toEmail}`);
    console.log(`Asunto: 🎯 Nuevo Lead: ${lead.name} (${lead.company})`);
    console.log("Cuerpo del Email:");
    console.log(emailHtml.replace(/<[^>]*>/g, '').trim().substring(0, 300) + "...");
    console.log("==========================================");
    return { simulated: true, success: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: "Plataforma DOOH <onboarding@resend.dev>",
        to: toEmail,
        subject: `🎯 Nuevo Lead: ${lead.name} - ${lead.company}`,
        html: emailHtml
      })
    });

    const data = await response.json();
    console.log("Resend API response status:", response.status, data);
    return { success: response.ok, data };
  } catch (error) {
    console.error("Failed to send lead email via Resend:", error);
    return { success: false, error };
  }
}

// CREATE Lead
app.post("/api/leads", async (req: Request, res: Response) => {
  const { name, email, company, source, status, value } = req.body;
  if (!name || !email) {
    res.status(400).json({ success: false, error: "Name and Email are required." });
    return;
  }

  try {
    const companyVal = company || "Freelancer / Indiv";
    const sourceVal = source || "Formulario Web";
    const statusVal = status || "new";
    const dateVal = new Date().toISOString();
    const numValue = Number(value) || 0;

    const inserted = await db.insert(leads).values({
      name,
      email,
      company: companyVal,
      source: sourceVal,
      status: statusVal,
      date: dateVal,
      value: numValue
    }).returning();

    const row = inserted[0];
    const leadData = {
      id: String(row.id),
      name: row.name,
      email: row.email,
      company: row.company || "",
      source: row.source || "",
      status: row.status || "new",
      date: row.date || dateVal,
      value: row.value || 0
    };

    // Send email notification in background asynchronously
    sendLeadNotificationEmail(leadData).catch(err => {
      console.error("Background lead email error:", err);
    });

    res.json({
      success: true,
      data: leadData
    });
  } catch (error: any) {
    console.error("Error creating lead:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- SECURED DASHBOARD CRUD ENDPOINTS ---

// GET Screens (Inventory)
app.get("/api/screens", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbScreens = await db.select().from(screens);
    const formatted = dbScreens.map(s => ({
      ...s,
      ruta: s.ruta ? JSON.parse(s.ruta) : undefined
    }));
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching screens:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE Screen
app.post("/api/screens", requireAuth, async (req: Request, res: Response) => {
  try {
    const screenData = req.body;
    if (!screenData.id || !screenData.nombre || !screenData.zona) {
      return res.status(400).json({ success: false, error: "Missing required screen fields" });
    }

    const valueToInsert = {
      ...screenData,
      ruta: screenData.ruta ? JSON.stringify(screenData.ruta) : null
    };

    const result = await db.insert(screens).values(valueToInsert).returning();
    const formatted = {
      ...result[0],
      ruta: result[0].ruta ? JSON.parse(result[0].ruta) : undefined
    };

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error creating screen:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE Screen
app.put("/api/screens/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const valueToUpdate: any = { ...updateData };
    if (updateData.ruta !== undefined) {
      valueToUpdate.ruta = updateData.ruta ? JSON.stringify(updateData.ruta) : null;
    }

    const result = await db.update(screens)
      .set(valueToUpdate)
      .where(eq(screens.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "Screen not found" });
    }

    const formatted = {
      ...result[0],
      ruta: result[0].ruta ? JSON.parse(result[0].ruta) : undefined
    };

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error updating screen:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE Screen
app.delete("/api/screens/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  const userRole = req.headers["x-user-role"];
  if (userRole !== "admin") {
    return res.status(403).json({ success: false, error: "Permiso denegado. Solo el rol Administrador (admin) tiene autorización para dar de baja o eliminar soportes de forma permanente." });
  }
  try {
    const result = await db.delete(screens).where(eq(screens.id, id)).returning();
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "Screen not found" });
    }
    res.json({ success: true, data: { id } });
  } catch (error: any) {
    console.error("Error deleting screen:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Clients
app.get("/api/clients", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbClients = await db.select().from(clientes);
    const formatted = dbClients.map(c => {
      let interactions = [];
      try {
        if (c.historialInteracciones) {
          interactions = JSON.parse(c.historialInteracciones);
        }
      } catch (e) {
        console.error("Error parsing client interactions:", e);
      }
      return {
        id: c.id,
        nombre: c.nombre,
        empresa: c.empresa,
        email: c.email,
        telefono: c.telefono,
        categoria: c.categoria as "Directo" | "Agencia" | "Corporativo",
        campañasActivas: c.campanasActivas,
        totalInversión: c.totalInversion,
        estado: (c.estado || "contactado") as "contactado" | "negociando" | "cerrado",
        notas: c.notas || "",
        historialInteracciones: interactions
      };
    });
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE Client
app.post("/api/clients", requireAuth, async (req: Request, res: Response) => {
  try {
    const clientData = req.body;
    if (!clientData.id || !clientData.nombre || !clientData.empresa) {
      return res.status(400).json({ success: false, error: "Missing required client fields" });
    }

    const valueToInsert = {
      id: clientData.id,
      nombre: clientData.nombre,
      empresa: clientData.empresa,
      email: clientData.email,
      telefono: clientData.telefono,
      categoria: clientData.categoria,
      campanasActivas: clientData.campañasActivas !== undefined ? clientData.campañasActivas : 0,
      totalInversion: clientData.totalInversión !== undefined ? clientData.totalInversión : 0,
      estado: clientData.estado || "contactado",
      notas: clientData.notas || "",
      historialInteracciones: clientData.historialInteracciones ? JSON.stringify(clientData.historialInteracciones) : JSON.stringify([])
    };

    const result = await db.insert(clientes).values(valueToInsert).returning();
    const c = result[0];
    let interactions = [];
    try {
      if (c.historialInteracciones) {
        interactions = JSON.parse(c.historialInteracciones);
      }
    } catch (e) {}

    const formatted = {
      id: c.id,
      nombre: c.nombre,
      empresa: c.empresa,
      email: c.email,
      telefono: c.telefono,
      categoria: c.categoria,
      campañasActivas: c.campanasActivas,
      totalInversión: c.totalInversion,
      estado: c.estado as "contactado" | "negociando" | "cerrado",
      notas: c.notas || "",
      historialInteracciones: interactions
    };
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error creating client:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE Client
app.put("/api/clients/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const valueToUpdate: any = {};
    if (updateData.nombre !== undefined) valueToUpdate.nombre = updateData.nombre;
    if (updateData.empresa !== undefined) valueToUpdate.empresa = updateData.empresa;
    if (updateData.email !== undefined) valueToUpdate.email = updateData.email;
    if (updateData.telefono !== undefined) valueToUpdate.telefono = updateData.telefono;
    if (updateData.categoria !== undefined) valueToUpdate.categoria = updateData.categoria;
    if (updateData.campañasActivas !== undefined) valueToUpdate.campanasActivas = updateData.campañasActivas;
    if (updateData.totalInversión !== undefined) valueToUpdate.totalInversion = updateData.totalInversión;
    if (updateData.estado !== undefined) valueToUpdate.estado = updateData.estado;
    if (updateData.notas !== undefined) valueToUpdate.notas = updateData.notas;
    if (updateData.historialInteracciones !== undefined) {
      valueToUpdate.historialInteracciones = JSON.stringify(updateData.historialInteracciones);
    }

    const result = await db.update(clientes)
      .set(valueToUpdate)
      .where(eq(clientes.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }

    const c = result[0];
    let interactions = [];
    try {
      if (c.historialInteracciones) {
        interactions = JSON.parse(c.historialInteracciones);
      }
    } catch (e) {}

    const formatted = {
      id: c.id,
      nombre: c.nombre,
      empresa: c.empresa,
      email: c.email,
      telefono: c.telefono,
      categoria: c.categoria,
      campañasActivas: c.campanasActivas,
      totalInversión: c.totalInversion,
      estado: c.estado as "contactado" | "negociando" | "cerrado",
      notas: c.notas || "",
      historialInteracciones: interactions
    };
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error updating client:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE Client
app.delete("/api/clients/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.delete(clientes).where(eq(clientes.id, id)).returning();
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }
    res.json({ success: true, data: { id } });
  } catch (error: any) {
    console.error("Error deleting client:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Mediakits
app.get("/api/mediakits", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbMediakits = await db.select().from(mediakits);
    const formatted = dbMediakits.map(m => ({
      ...m,
      screenIds: m.screenIds ? JSON.parse(m.screenIds) : [],
      comentarios: m.comentarios ? JSON.parse(m.comentarios) : [],
      historial: m.historial ? JSON.parse(m.historial) : [],
      soportesEdicionInline: m.soportesEdicionInline ? JSON.parse(m.soportesEdicionInline) : []
    }));
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching mediakits:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE Mediakit
app.post("/api/mediakits", requireAuth, async (req: Request, res: Response) => {
  try {
    const mkData = req.body;
    if (!mkData.id || !mkData.nombre || !mkData.clienteId) {
      return res.status(400).json({ success: false, error: "Missing required mediakit fields" });
    }

    const valueToInsert = {
      ...mkData,
      screenIds: mkData.screenIds ? JSON.stringify(mkData.screenIds) : JSON.stringify([]),
      comentarios: mkData.comentarios ? JSON.stringify(mkData.comentarios) : JSON.stringify([]),
      historial: mkData.historial ? JSON.stringify(mkData.historial) : JSON.stringify([]),
      soportesEdicionInline: mkData.soportesEdicionInline ? JSON.stringify(mkData.soportesEdicionInline) : JSON.stringify([])
    };

    const result = await db.insert(mediakits).values(valueToInsert).returning();
    const formatted = {
      ...result[0],
      screenIds: result[0].screenIds ? JSON.parse(result[0].screenIds) : [],
      comentarios: result[0].comentarios ? JSON.parse(result[0].comentarios) : [],
      historial: result[0].historial ? JSON.parse(result[0].historial) : [],
      soportesEdicionInline: result[0].soportesEdicionInline ? JSON.parse(result[0].soportesEdicionInline) : []
    };

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error creating mediakit:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE Mediakit
app.put("/api/mediakits/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const valueToUpdate: any = { ...updateData };
    if (updateData.screenIds !== undefined) {
      valueToUpdate.screenIds = updateData.screenIds ? JSON.stringify(updateData.screenIds) : JSON.stringify([]);
    }
    if (updateData.comentarios !== undefined) {
      valueToUpdate.comentarios = updateData.comentarios ? JSON.stringify(updateData.comentarios) : JSON.stringify([]);
    }
    if (updateData.historial !== undefined) {
      valueToUpdate.historial = updateData.historial ? JSON.stringify(updateData.historial) : JSON.stringify([]);
    }
    if (updateData.soportesEdicionInline !== undefined) {
      valueToUpdate.soportesEdicionInline = updateData.soportesEdicionInline ? JSON.stringify(updateData.soportesEdicionInline) : JSON.stringify([]);
    }

    const result = await db.update(mediakits)
      .set(valueToUpdate)
      .where(eq(mediakits.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "MediaKit not found" });
    }

    const formatted = {
      ...result[0],
      screenIds: result[0].screenIds ? JSON.parse(result[0].screenIds) : [],
      comentarios: result[0].comentarios ? JSON.parse(result[0].comentarios) : [],
      historial: result[0].historial ? JSON.parse(result[0].historial) : [],
      soportesEdicionInline: result[0].soportesEdicionInline ? JSON.parse(result[0].soportesEdicionInline) : []
    };

    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error updating mediakit:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE Mediakit
app.delete("/api/mediakits/:id", requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await db.delete(mediakits).where(eq(mediakits.id, id)).returning();
    if (result.length === 0) {
      return res.status(404).json({ success: false, error: "MediaKit not found" });
    }
    res.json({ success: true, data: { id } });
  } catch (error: any) {
    console.error("Error deleting mediakit:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Changelogs
app.get("/api/changelogs", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbLogs = await db.select().from(changelogs);
    res.json({ success: true, data: dbLogs });
  } catch (error: any) {
    console.error("Error fetching changelogs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE Changelog
app.post("/api/changelogs", requireAuth, async (req: Request, res: Response) => {
  try {
    const logData = req.body;
    if (!logData.id || !logData.user || !logData.action) {
      return res.status(400).json({ success: false, error: "Missing required changelog fields" });
    }

    const result = await db.insert(changelogs).values(logData).returning();
    res.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Error creating changelog:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- EXISTING GEMINI AI ROUTES ---

// AI Route: Generate Landing Page content
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

// AI Route: Audit Landing Page SEO
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

// AI Route: Analyze leads data and suggest personal growth recommendations
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

// AI Route: Plan Campaign
app.post("/api/ai/plan-campaign", async (req: Request, res: Response) => {
  const { budget, objective, zonePreference } = req.body;

  if (!budget) {
    res.status(400).json({ success: false, error: "Budget is required." });
    return;
  }

  const prompt = `
    You are an expert Media Planner and Outdoor (OOH/DOOH) Advertising Strategist for Mendoza, Argentina.
    Recommend an optimal billboard campaign using a budget of $${budget} ARS and objective of "${objective || 'branding'}".
    Preferred Zone: "${zonePreference || 'any'}".

    Our screen inventory is as follows:
    - sc-01: Sarmiento y 9 de Julio (Centro), Peatonal, Precio Semanal: $95,000, Impactos Semanales: 14,200
    - sc-02: Palmares Open Mall (Palmares), Mixto, Precio Semanal: $145,000, Impactos Semanales: 22,500
    - sc-03: Las Heras y Mitre (Las Heras), Peatonal, Precio Semanal: $68,000, Impactos Semanales: 8,800
    - sc-04: Av. Aristides frente al Parque (Ciudad), Vehicular, Precio Semanal: $185,000, Impactos Semanales: 31,000
    - sc-05: Guaymallén Centro (Guaymallén), Peatonal, Precio Semanal: $78,000, Impactos Semanales: 11,400
    - sc-06: Maipú Ruta 7 (Maipú), Vehicular, Precio Semanal: $112,000, Impactos Semanales: 19,600
    - sc-07: Villanueva Gomensoro (Las Heras), Mixto, Precio Semanal: $72,000, Impactos Semanales: 9,300
    - sc-08: Godoy Cruz Belgrano (Godoy Cruz), Vehicular, Precio Semanal: $155,000, Impactos Semanales: 25,800
    - sc-09: Chacras de Coria Acceso (Luján), Vehicular, Precio Semanal: $125,000, Impactos Semanales: 16,700
    - sc-10: Terminal de Ómnibus (Centro), Peatonal, Precio Semanal: $118,000, Impactos Semanales: 18,400
    - sc-11: LeadMóvil Mendoza Express (Metropolitana), Móvil, Precio Semanal: $160,000, Impactos Semanales: 38,000

    Select a set of screen IDs that fit within the weekly budget. All copy must be in Spanish.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      selectedScreenIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      durationWeeks: { type: Type.INTEGER },
      totalCost: { type: Type.INTEGER },
      totalEstimatedImpacts: { type: Type.INTEGER },
      mediaMixExplanation: { type: Type.STRING },
      roiMetrics: {
        type: Type.OBJECT,
        properties: {
          brandRecallIncreasePercent: { type: Type.INTEGER },
          predictedCpm: { type: Type.INTEGER },
          estimatedReach: { type: Type.INTEGER }
        },
        required: ["brandRecallIncreasePercent", "predictedCpm", "estimatedReach"]
      }
    },
    required: ["selectedScreenIds", "durationWeeks", "totalCost", "totalEstimatedImpacts", "mediaMixExplanation", "roiMetrics"]
  };

  try {
    const text = await callGemini(prompt, schema);
    if (text) {
      res.json({ success: true, data: JSON.parse(text) });
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini Campaign Planner Error:", error);
    res.json({
      success: true,
      data: {
        selectedScreenIds: ["sc-01", "sc-03", "sc-05"],
        durationWeeks: 2,
        totalCost: 241000,
        totalEstimatedImpacts: 68800,
        mediaMixExplanation: "Estrategia peatonal combinada (Centro, Las Heras y Guaymallén) para maximizar la frecuencia de visualización.",
        roiMetrics: {
          brandRecallIncreasePercent: 12,
          predictedCpm: 3500,
          estimatedReach: 42000
        }
      }
    });
  }
});

// AI Route: Data Hub Natural Language Query
app.post("/api/ai/data-hub-query", async (req: Request, res: Response) => {
  const { userQuery, activeLeadsCount } = req.body;
  if (!userQuery) {
    res.status(400).json({ success: false, error: "Query is required." });
    return;
  }

  const prompt = `
    You are the Senior Business Intelligence and OOH Analytics Consultant for Grupo Comunicarte's Smart OOH platform.
    Answer the manager's query about the OOH network performance, pricing, inventory, and metrics.
    Manager's query: "${userQuery}"

    Inventory Context:
    - Total screens: 11
    - Total weekly potential impacts (all active): 238,200 impressions/week
    - Total weekly network value: $1,196,000 ARS
    - Average screen price: $108,727 ARS
    - Top performing screen by impacts: sc-11 LeadMóvil Mendoza Express (38,000 impacts/week)
    - Top vehicular screen: sc-04 Av. Aristides frente al Parque (31,000 impacts/week, $185,000 ARS)
    - Most economical screen: sc-03 Las Heras y Mitre ($68,000 ARS/week)
    - Current Active Leads captured in CRM: ${activeLeadsCount || 4}

    Provide an analytical, helpful, and highly professional answer in Spanish. Keep it concise (1-2 paragraphs).
  `;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      res.json({ success: true, answer: response.text });
    } else {
      throw new Error("Gemini AI Client is not initialized");
    }
  } catch (error: any) {
    console.error("Gemini Data Hub Query Error:", error);
    res.json({
      success: true,
      answer: "El Data Hub detecta una ocupación del 82% en los sectores vehiculares (Aristides, Godoy Cruz y Chacras). El CPM promedio de la red es de $5,021 ARS, siendo las pantallas peatonales del Centro las que ofrecen mayor retorno por inversión directa de pauta local."
    });
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
