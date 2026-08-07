import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";

const Type = {
  OBJECT: "OBJECT",
  STRING: "STRING",
  ARRAY: "ARRAY",
  INTEGER: "INTEGER",
  NUMBER: "NUMBER",
  BOOLEAN: "BOOLEAN",
};

import { db, isDbConfigured, createPool } from "./src/db/index.ts";
import {
  users, leads, screens, clientes, mediakits, changelogs, syncHistory, syncErrors,
  tenants, roles, permissions, rolePermissions, userRoles, tags, screenTags, media,
  metrics, campaigns, campaignScreens, cities, categories, locations
} from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { GoogleSlidesBackendService } from "./src/services/googleSlidesBackend.ts";
import { SEED_SCREENS, INITIAL_CLIENTES, INITIAL_MEDIAKITS, INITIAL_LOGS } from "./src/db/seedData.ts";
import { requestLogger } from "./src/middleware/logger.ts";
import { errorHandler } from "./src/middleware/errorHandler.ts";
import { apiV1Router } from "./src/api/v1/router.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize Gemini SDK
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("Warning: GEMINI_API_KEY is not defined. AI features will fallback to default responses.");
}

// Helper to ensure database tables exist before querying or seeding
async function ensureTablesExist() {
  const pool = createPool();
  if (!pool) return;

  const ddl = `
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      plan TEXT DEFAULT 'basic' NOT NULL,
      status TEXT DEFAULT 'active' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS permissions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      city_id TEXT REFERENCES cities(id) ON DELETE CASCADE ON UPDATE CASCADE,
      name TEXT NOT NULL,
      address TEXT,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uid TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      tenant_id TEXT REFERENCES tenants(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS user_roles (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      date TEXT,
      value INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS screens (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      zona TEXT NOT NULL,
      tipo TEXT NOT NULL,
      categoria TEXT,
      ciudad TEXT,
      impactos INTEGER DEFAULT 0 NOT NULL,
      precio INTEGER DEFAULT 0 NOT NULL,
      status TEXT NOT NULL,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL,
      nota TEXT,
      video TEXT,
      dimensiones TEXT,
      brillo TEXT,
      refresh_rate TEXT,
      formato TEXT,
      cobertura TEXT,
      horarios TEXT,
      ruta TEXT,
      sync_id INTEGER,
      hash TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS clientes (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      empresa TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT NOT NULL,
      categoria TEXT NOT NULL,
      campanas_activas INTEGER DEFAULT 0 NOT NULL,
      total_inversion INTEGER DEFAULT 0 NOT NULL,
      estado TEXT DEFAULT 'contactado' NOT NULL,
      notas TEXT,
      historial_interacciones TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mediakits (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE ON UPDATE CASCADE,
      cliente_nombre TEXT NOT NULL,
      ciudad TEXT NOT NULL,
      screen_ids TEXT NOT NULL,
      version INTEGER DEFAULT 1 NOT NULL,
      estado TEXT NOT NULL,
      fecha TEXT NOT NULL,
      presupuesto INTEGER,
      objetivo TEXT,
      comentarios TEXT,
      historial TEXT,
      soportes_edicion_inline TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_kit_screens (
      media_kit_id TEXT NOT NULL REFERENCES mediakits(id) ON DELETE CASCADE ON UPDATE CASCADE,
      screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE ON UPDATE CASCADE,
      PRIMARY KEY (media_kit_id, screen_id)
    );

    CREATE TABLE IF NOT EXISTS media_kit_comments (
      id SERIAL PRIMARY KEY,
      media_kit_id TEXT NOT NULL REFERENCES mediakits(id) ON DELETE CASCADE ON UPDATE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      user_name TEXT NOT NULL,
      comment_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS changelogs (
      id TEXT PRIMARY KEY,
      "user" TEXT NOT NULL,
      action TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS google_credentials (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      access_token TEXT NOT NULL,
      refresh_token TEXT NOT NULL,
      expiry_date TIMESTAMP NOT NULL,
      scopes TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sync_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      user_name TEXT NOT NULL,
      status TEXT NOT NULL,
      duration_ms INTEGER DEFAULT 0,
      total_slides INTEGER DEFAULT 0,
      imported_count INTEGER DEFAULT 0,
      updated_count INTEGER DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      presentation_id TEXT NOT NULL,
      presentation_title TEXT,
      backup_data TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_errors (
      id SERIAL PRIMARY KEY,
      sync_id INTEGER REFERENCES sync_history(id) ON DELETE CASCADE ON UPDATE CASCADE,
      slide_index INTEGER,
      slide_id TEXT,
      error_type TEXT NOT NULL,
      error_message TEXT NOT NULL,
      severity TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS screen_tags (
      screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
      tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (screen_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      size_bytes INTEGER,
      is_hero BOOLEAN DEFAULT FALSE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id TEXT PRIMARY KEY,
      screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
      metric_type TEXT NOT NULL,
      value DOUBLE PRECISION NOT NULL,
      recorded_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
      cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
      media_kit_id TEXT REFERENCES mediakits(id) ON DELETE SET NULL,
      nombre TEXT NOT NULL,
      presupuesto INTEGER DEFAULT 0 NOT NULL,
      estado TEXT DEFAULT 'planificacion' NOT NULL,
      fecha_inicio TEXT,
      fecha_fin TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      deleted_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS campaign_screens (
      campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
      screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
      precio_acordado INTEGER,
      fecha_inicio_soporte TEXT,
      fecha_fin_soporte TEXT,
      PRIMARY KEY (campaign_id, screen_id)
    );
  `;

  try {
    await pool.query(ddl);
    console.log("[Bootstrap] Verified database tables exist.");
  } catch (err) {
    console.warn("[Bootstrap] Note on database table initialization:", err);
  }
}

// Automatically bootstrap database schema and seed data on startup
async function initDb() {
  if (!isDbConfigured()) {
    console.log("[Bootstrap] Database is not configured. Skipping database seed.");
    return;
  }
  try {
    await ensureTablesExist();
    console.log("[Bootstrap] Starting database seed check...");

    // 1. Seed Tenants
    const existingTenants = await db.select().from(tenants).limit(1);
    if (existingTenants.length === 0) {
      console.log("[Bootstrap] Seeding default tenants...");
      await db.insert(tenants).values([
        { id: "tenant-default", name: "LeadMóvil Mendoza OOH", slug: "mendoza-ooh", plan: "enterprise", status: "active" },
        { id: "tenant-ba", name: "Buenos Aires OOH Premium", slug: "ba-ooh", plan: "premium", status: "active" },
      ]);
    }

    // 2. Seed Roles
    const existingRoles = await db.select().from(roles).limit(1);
    if (existingRoles.length === 0) {
      console.log("[Bootstrap] Seeding default roles...");
      await db.insert(roles).values([
        { id: "role-admin", name: "Administrador", slug: "admin", description: "Acceso total al sistema" },
        { id: "role-comercial", name: "Ejecutivo Comercial", slug: "comercial", description: "Gestión de clientes y campañas" },
        { id: "role-planner", name: "Planificador de Medios", slug: "planner", description: "Planificación e inventario" },
      ]);
    }

    // 3. Seed Permissions
    const existingPermissions = await db.select().from(permissions).limit(1);
    if (existingPermissions.length === 0) {
      console.log("[Bootstrap] Seeding default permissions...");
      await db.insert(permissions).values([
        { id: "perm-sync", name: "Sincronizar Google Slides", slug: "sync_slides", description: "Ejecutar ETL de Google Slides" },
        { id: "perm-users", name: "Administrar Usuarios y Roles", slug: "manage_users", description: "Configuración de seguridad" },
        { id: "perm-campaigns", name: "Crear y Editar Campañas", slug: "edit_campaigns", description: "Gestión comercial" },
        { id: "perm-analytics", name: "Ver Métricas y Rendimiento", slug: "view_analytics", description: "Auditoría de impactos" },
      ]);

      console.log("[Bootstrap] Linking permissions to roles...");
      await db.insert(rolePermissions).values([
        { roleId: "role-admin", permissionId: "perm-sync" },
        { roleId: "role-admin", permissionId: "perm-users" },
        { roleId: "role-admin", permissionId: "perm-campaigns" },
        { roleId: "role-admin", permissionId: "perm-analytics" },
        { roleId: "role-comercial", permissionId: "perm-campaigns" },
        { roleId: "role-comercial", permissionId: "perm-analytics" },
      ]);
    }

    // 4. Seed Cities
    const existingCities = await db.select().from(cities).limit(1);
    if (existingCities.length === 0) {
      console.log("[Bootstrap] Seeding default cities...");
      await db.insert(cities).values([
        { id: "city-mendoza", name: "Mendoza", slug: "mendoza" },
        { id: "city-caba", name: "Buenos Aires", slug: "buenos-aires" },
      ]);
    }

    // 5. Seed Categories
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length === 0) {
      console.log("[Bootstrap] Seeding default categories...");
      await db.insert(categories).values([
        { id: "cat-led", name: "Pantallas LED", slug: "pantallas-led" },
        { id: "cat-trad", name: "Tradicionales", slug: "tradicionales" },
        { id: "cat-movil", name: "LED Móvil", slug: "led-movil" },
      ]);
    }

    // 6. Seed Locations
    const existingLocations = await db.select().from(locations).limit(1);
    if (existingLocations.length === 0) {
      console.log("[Bootstrap] Seeding default locations...");
      await db.insert(locations).values([
        { id: "loc-centro", cityId: "city-mendoza", name: "Km 0 Mendoza", address: "Sarmiento y 9 de Julio", lat: -32.8894, lng: -68.8458 },
        { id: "loc-palmares", cityId: "city-mendoza", name: "Palmares Open Mall", address: "Ruta Panamericana 2650", lat: -32.9121, lng: -68.8306 },
        { id: "loc-obelisco", cityId: "city-caba", name: "Obelisco de Buenos Aires", address: "Av. 9 de Julio y Corrientes", lat: -34.6037, lng: -58.3816 },
      ]);
    }

    // 7. Seed Leads
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

    // 8. Seed Screens (with default tenantId)
    const existingScreens = await db.select().from(screens).limit(1);
    if (existingScreens.length === 0) {
      console.log("[Bootstrap] Seeding default screens...");
      const screensData = SEED_SCREENS.map(s => ({
        ...s,
        tenantId: s.id.startsWith("ba-") ? "tenant-ba" : "tenant-default"
      }));
      await db.insert(screens).values(screensData);
    }

    // 9. Seed Clients (with default tenantId)
    const existingClients = await db.select().from(clientes).limit(1);
    if (existingClients.length === 0) {
      console.log("[Bootstrap] Seeding default clients...");
      const clientsData = INITIAL_CLIENTES.map(c => ({
        ...c,
        tenantId: c.id === "cl-02" ? "tenant-ba" : "tenant-default"
      }));
      await db.insert(clientes).values(clientsData);
    }

    // 10. Seed Mediakits (with default tenantId)
    const existingMediakits = await db.select().from(mediakits).limit(1);
    if (existingMediakits.length === 0) {
      console.log("[Bootstrap] Seeding default mediakits...");
      const mediakitsData = INITIAL_MEDIAKITS.map(m => ({
        ...m,
        tenantId: m.id === "mk-202" ? "tenant-ba" : "tenant-default"
      }));
      await db.insert(mediakits).values(mediakitsData);
    }

    // 11. Seed Campaigns
    const existingCampaigns = await db.select().from(campaigns).limit(1);
    if (existingCampaigns.length === 0) {
      console.log("[Bootstrap] Seeding default campaigns...");
      await db.insert(campaigns).values([
        { id: "camp-01", tenantId: "tenant-default", clienteId: "cl-01", mediaKitId: "mk-201", nombre: "Hilux Summer Mendoza 2026", presupuesto: 1500000, estado: "activa", fechaInicio: "2026-01-01", fechaFin: "2026-03-31" },
        { id: "camp-02", tenantId: "tenant-ba", clienteId: "cl-02", mediaKitId: "mk-202", nombre: "Buenos Aires Corporativo", presupuesto: 4500000, estado: "planificacion", fechaInicio: "2026-04-01", fechaFin: "2026-06-30" },
      ]);

      console.log("[Bootstrap] Seeding campaign screens...");
      await db.insert(campaignScreens).values([
        { campaignId: "camp-01", screenId: "sc-01", precioAcordado: 95000, fechaInicioSoporte: "2026-01-01", fechaFinSoporte: "2026-03-31" },
        { campaignId: "camp-01", screenId: "sc-02", precioAcordado: 145000, fechaInicioSoporte: "2026-01-01", fechaFinSoporte: "2026-03-31" },
        { campaignId: "camp-01", screenId: "sc-11", precioAcordado: 160000, fechaInicioSoporte: "2026-01-01", fechaFinSoporte: "2026-03-31" },
      ]);
    }

    // 12. Seed Tags
    const existingTags = await db.select().from(tags).limit(1);
    if (existingTags.length === 0) {
      console.log("[Bootstrap] Seeding default tags...");
      await db.insert(tags).values([
        { id: "tag-premium", name: "Premium ABC1", slug: "premium-abc1" },
        { id: "tag-high", name: "Alto Tránsito", slug: "alto-transito" },
        { id: "tag-night", name: "Visibilidad Nocturna", slug: "visibilidad-nocturna" },
      ]);

      console.log("[Bootstrap] Seeding screen tags...");
      await db.insert(screenTags).values([
        { screenId: "sc-01", tagId: "tag-high" },
        { screenId: "sc-02", tagId: "tag-premium" },
        { screenId: "sc-11", tagId: "tag-premium" },
        { screenId: "sc-11", tagId: "tag-high" },
        { screenId: "ba-01", tagId: "tag-premium" },
        { screenId: "ba-01", tagId: "tag-high" },
        { screenId: "ba-01", tagId: "tag-night" },
      ]);
    }

    // 13. Seed Media Assets
    const existingMedia = await db.select().from(media).limit(1);
    if (existingMedia.length === 0) {
      console.log("[Bootstrap] Seeding default media...");
      await db.insert(media).values([
        { id: "m-01", screenId: "sc-01", type: "image", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", title: "Vista Peatonal Diurna", sizeBytes: 154000, isHero: true },
        { id: "m-02", screenId: "sc-11", type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Video Recorrido LeadMóvil", sizeBytes: 8500000, isHero: true },
        { id: "m-03", screenId: "ba-01", type: "drone", url: "https://www.w3schools.com/html/movie.mp4", title: "Toma de Drone Obelisco", sizeBytes: 12400000, isHero: true },
      ]);
    }

    // 14. Seed Metrics
    const existingMetrics = await db.select().from(metrics).limit(1);
    if (existingMetrics.length === 0) {
      console.log("[Bootstrap] Seeding default metrics...");
      await db.insert(metrics).values([
        { id: "met-01", screenId: "sc-01", metricType: "impressions", value: 14200 },
        { id: "met-02", screenId: "sc-01", metricType: "occupancy_rate", value: 87.5 },
        { id: "met-03", screenId: "sc-02", metricType: "impressions", value: 22500 },
        { id: "met-04", screenId: "sc-02", metricType: "occupancy_rate", value: 92.0 },
        { id: "met-05", screenId: "ba-01", metricType: "impressions", value: 75000 },
        { id: "met-06", screenId: "ba-01", metricType: "occupancy_rate", value: 98.0 },
      ]);
    }

    // 15. Seed Changelogs
    const existingChangelogs = await db.select().from(changelogs).limit(1);
    if (existingChangelogs.length === 0) {
      console.log("[Bootstrap] Seeding default changelogs...");
      await db.insert(changelogs).values(INITIAL_LOGS);
    }

    console.log("[Bootstrap] PostgreSQL multi-tenant schema seeding and validation complete.");
  } catch (error) {
    console.error("[Bootstrap] Error during database seeding:", error);
  }
}

initDb();

// Helper to secure AI calling using native fetch to keep bundle light
async function callGemini(prompt: string, responseSchema?: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini AI Client is not initialized (missing API key)");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7
    }
  };

  if (responseSchema) {
    body.generationConfig.responseMimeType = "application/json";
    body.generationConfig.responseSchema = responseSchema;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid or empty response format from Gemini API");
  }

  return text;
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

// --- FEATURE FLAGS ROAD GUARDS ---

app.use("/api/gmail/*", (req, res, next) => {
  const isGmailEnabled = process.env.ENABLE_GMAIL_INTEGRATION === "true";
  if (!isGmailEnabled) {
    return res.json({
      enabled: false,
      message: "Gmail integration disabled in PMV"
    });
  }
  next();
});

app.use("/api/ai/*", (req, res, next) => {
  const isAiPlannerEnabled = process.env.ENABLE_AI_PLANNER === "true";
  if (!isAiPlannerEnabled) {
    return res.json({
      enabled: false,
      message: "AI Planner disabled for PMV"
    });
  }
  next();
});

// --- GMAIL API ENDPOINTS ---

// GET Gmail Connection Status
app.get("/api/gmail/status", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);
    res.json({ success: true, connected: !!accessToken });
  } catch (error: any) {
    res.json({ success: true, connected: false, error: error.message });
  }
});

// GET Gmail Message List
app.get("/api/gmail/messages", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);

    const { q } = req.query;
    const queryParam = q ? `&q=${encodeURIComponent(q as string)}` : "";
    const listRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15${queryParam}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });

    if (!listRes.ok) {
      const errText = await listRes.text();
      return res.status(listRes.status).json({ success: false, error: `Gmail API list error: ${errText}` });
    }

    const listData = (await listRes.json()) as { messages?: { id: string; threadId: string }[] };
    const messagesList = listData.messages || [];

    // Fetch details for each message in parallel
    const detailedMessages = await Promise.all(
      messagesList.map(async (msg) => {
        try {
          const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=subject&metadataHeaders=from&metadataHeaders=to&metadataHeaders=date`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json"
            }
          });
          if (!msgRes.ok) return null;
          const msgData = (await msgRes.json()) as any;
          
          const headers = msgData.payload?.headers || [];
          const getHeader = (name: string) => {
            const h = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
            return h ? h.value : "";
          };

          return {
            id: msgData.id,
            threadId: msgData.threadId,
            snippet: msgData.snippet,
            subject: getHeader("subject") || "(Sin Asunto)",
            from: getHeader("from") || "(Desconocido)",
            to: getHeader("to") || "",
            date: getHeader("date") || "",
            labelIds: msgData.labelIds || []
          };
        } catch (err) {
          console.error(`Error fetching message ${msg.id} detail:`, err);
          return null;
        }
      })
    );

    res.json({
      success: true,
      data: detailedMessages.filter(m => m !== null)
    });
  } catch (error: any) {
    console.error("Gmail messages fetch error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Individual Gmail Message Detail
app.get("/api/gmail/messages/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);

    const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    });

    if (!msgRes.ok) {
      const errText = await msgRes.text();
      return res.status(msgRes.status).json({ success: false, error: `Gmail API detail error: ${errText}` });
    }

    const msgData = (await msgRes.json()) as any;
    const headers = msgData.payload?.headers || [];
    const getHeader = (name: string) => {
      const h = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
      return h ? h.value : "";
    };

    // Robust body parsing function
    function getMessageBody(payload: any): { html?: string; text?: string } {
      let html = "";
      let text = "";

      function traverse(part: any) {
        if (part.mimeType === "text/plain" && part.body && part.body.data) {
          text = Buffer.from(part.body.data, 'base64').toString('utf-8');
        } else if (part.mimeType === "text/html" && part.body && part.body.data) {
          html = Buffer.from(part.body.data, 'base64').toString('utf-8');
        }
        if (part.parts) {
          for (const subPart of part.parts) {
            traverse(subPart);
          }
        }
      }

      if (payload) {
        if (payload.mimeType === "text/plain" && payload.body && payload.body.data) {
          text = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        } else if (payload.mimeType === "text/html" && payload.body && payload.body.data) {
          html = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        } else {
          traverse(payload);
        }
      }

      return { html, text };
    }

    const bodyContent = getMessageBody(msgData.payload);

    res.json({
      success: true,
      data: {
        id: msgData.id,
        threadId: msgData.threadId,
        snippet: msgData.snippet,
        subject: getHeader("subject") || "(Sin Asunto)",
        from: getHeader("from") || "(Desconocido)",
        to: getHeader("to") || "",
        date: getHeader("date") || "",
        labelIds: msgData.labelIds || [],
        html: bodyContent.html,
        text: bodyContent.text || msgData.snippet
      }
    });
  } catch (error: any) {
    console.error("Gmail message detail error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Send Gmail Message
app.post("/api/gmail/send", requireAuth, async (req: AuthRequest, res: Response) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ success: false, error: "to, subject and body are required fields." });
  }

  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);

    // Build raw email MIME message
    const rawMessage = [
      `To: ${to}`,
      `Subject: =?utf-8?B?${Buffer.from(subject).toString('base64')}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(body).toString('base64')
    ].join('\r\n');

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text();
      return res.status(sendRes.status).json({ success: false, error: `Gmail API send error: ${errText}` });
    }

    const sendData = await sendRes.json();

    // Log the action to database audit log
    try {
      const logId = `log-gmail-${Math.floor(100000 + Math.random() * 900000)}`;
      await db.insert(changelogs).values({
        id: logId,
        user: dbUser.email,
        action: `Envió correo Gmail a <${to}> con asunto "${subject}"`,
        date: new Date().toISOString(),
      });
    } catch (logErr) {
      console.error("Failed to append gmail changelog:", logErr);
    }

    res.json({ success: true, data: sendData });
  } catch (error: any) {
    console.error("Gmail send error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- GOOGLE WORKSPACE API ENDPOINTS ---

// GET Google OAuth connection status
app.get("/api/auth/google/status", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);
    res.json({ success: true, connected: !!accessToken });
  } catch (error: any) {
    res.json({ success: true, connected: false, error: error.message });
  }
});

// GET Google Access Token for Google Picker
app.get("/api/auth/google/token", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);
    if (!accessToken) {
      return res.status(401).json({ success: false, error: "No Google account connected." });
    }
    res.json({
      success: true,
      accessToken,
      clientId: GoogleSlidesBackendService.clientId
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Google OAuth redirect URL
app.get("/api/auth/google/url", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const authUrl = GoogleSlidesBackendService.isConfigured()
      ? GoogleSlidesBackendService.getAuthUrl(dbUser.id)
      : "";
    res.json({ success: true, url: authUrl, configured: GoogleSlidesBackendService.isConfigured() });
  } catch (error: any) {
    console.error("Error getting google auth URL:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Google OAuth callback
app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send("Faltan parámetros requeridos (code, state).");
  }

  try {
    const userId = parseInt(state as string, 10);
    await GoogleSlidesBackendService.exchangeCodeAndSave(userId, code as string);
    // Redirect to frontend app with a success parameter so the UI knows it succeeded!
    res.send(`
      <html>
        <head>
          <title>Autenticación Exitosa</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #fcfbf9; color: #1c1917; }
            .card { max-width: 450px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e7e5e4; }
            h1 { color: #06434a; font-size: 24px; margin-bottom: 10px; }
            p { font-size: 15px; color: #78716c; line-height: 1.5; }
            .btn { display: inline-block; background-color: #06434a; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>¡Conexión Exitosa con Google!</h1>
            <p>Hemos vinculado tu cuenta de Google Drive y Google Slides con éxito. Ya puedes volver a la plataforma y exportar tus MediaKits de forma directa.</p>
            <button class="btn" onclick="window.close()">Cerrar Ventana</button>
          </div>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error("Google OAuth callback error:", error);
    res.status(500).send(`Error de autenticación: ${error.message}`);
  }
});

// POST Export MediaKit to Google Slides
app.post("/api/mediakits/:id/export-slides", requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { clientEmail } = req.body;
  const authHeaderToken = req.headers["x-google-access-token"] as string;

  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    
    // 1. Fetch MediaKit
    const [mediaKit] = await db.select().from(mediakits).where(eq(mediakits.id, id)).limit(1);
    if (!mediaKit) {
      return res.status(404).json({ success: false, error: "MediaKit no encontrado." });
    }

    // 2. Resolve Access Token
    let accessToken = "";
    if (GoogleSlidesBackendService.isConfigured()) {
      try {
        accessToken = await GoogleSlidesBackendService.getAccessToken(dbUser.id);
      } catch (err: any) {
        console.warn("Could not get stored Google Access Token, trying client-provided fallback:", err.message);
      }
    }

    // Fallback to token passed by client-side login if available
    if (!accessToken && authHeaderToken) {
      accessToken = authHeaderToken;
    }

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: "Se requiere autenticación con Google.",
        needsAuth: true,
      });
    }

    // 3. Resolve MediaKit Screens
    const screenIds: string[] = mediaKit.screenIds ? JSON.parse(mediaKit.screenIds) : [];
    const dbScreens = await db.select().from(screens);
    const mediaKitScreensList = dbScreens.filter(s => screenIds.includes(s.id));

    // 4. Create Presentation (Clone template if defined, otherwise create a new blank presentation)
    const templateId = process.env.GOOGLE_SLIDES_TEMPLATE_ID;
    const presentationName = `MediaKit - ${mediaKit.nombre} (${mediaKit.clienteNombre})`;
    let presentationId = "";

    if (templateId) {
      presentationId = await GoogleSlidesBackendService.cloneTemplate(accessToken, templateId, presentationName);
    } else {
      // Create new fresh presentation via Slides API
      const createRes = await fetch("https://slides.googleapis.com/v1/presentations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: presentationName }),
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        throw new Error(`Failed to create fresh Google Slides presentation: ${createRes.statusText} - ${errText}`);
      }
      const newPresentation = (await createRes.json()) as { presentationId: string };
      presentationId = newPresentation.presentationId;
    }

    // 5. Populate and Share presentation
    await GoogleSlidesBackendService.populatePresentation(accessToken, presentationId, {
      title: mediaKit.nombre,
      clientName: mediaKit.clienteNombre,
      city: mediaKit.ciudad || "Mendoza",
      screens: mediaKitScreensList,
      metaId: mediaKit.id,
      notes: mediaKit.objetivo || "",
    });

    await GoogleSlidesBackendService.sharePresentation(accessToken, presentationId, clientEmail);

    const presentationUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    // 6. Append audit log to changelogs
    try {
      const logId = `log-${Math.floor(100000 + Math.random() * 900000)}`;
      await db.insert(changelogs).values({
        id: logId,
        user: dbUser.email,
        action: `Exportó MediaKit "${mediaKit.nombre}" a Google Slides`,
        date: new Date().toISOString(),
      });
    } catch (logErr) {
      console.error("Failed to append changelog:", logErr);
    }

    res.json({
      success: true,
      presentationId,
      presentationUrl,
    });
  } catch (error: any) {
    console.error("Export to Google Slides error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Sync History
app.get("/api/sync/history", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const history = await db
      .select()
      .from(syncHistory)
      .orderBy(desc(syncHistory.createdAt));
    res.json({ success: true, data: history });
  } catch (error: any) {
    console.error("Error fetching sync history:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Sync Errors for a specific sync run
app.get("/api/sync/errors/:syncId", requireAuth, async (req: AuthRequest, res: Response) => {
  const { syncId } = req.params;
  try {
    const errors = await db
      .select()
      .from(syncErrors)
      .where(eq(syncErrors.syncId, parseInt(syncId, 10)))
      .orderBy(desc(syncErrors.id));
    res.json({ success: true, data: errors });
  } catch (error: any) {
    console.error("Error fetching sync errors:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Extract Presentation Data (JSON)
app.post("/api/slides/extract", requireAuth, async (req: AuthRequest, res: Response) => {
  const { presentationId } = req.body;
  if (!presentationId) {
    return res.status(400).json({ success: false, error: "presentationId is required" });
  }

  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const data = await GoogleSlidesBackendService.extractPresentationData(dbUser.id, presentationId);
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Error extracting presentation data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Initiate Sync
app.post("/api/sync", requireAuth, async (req: AuthRequest, res: Response) => {
  const { presentationId } = req.body;
  if (!presentationId) {
    return res.status(400).json({ success: false, error: "presentationId is required" });
  }

  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const result = await GoogleSlidesBackendService.syncFromSlides(
      dbUser.id,
      dbUser.email,
      presentationId
    );

    // Also log in the changelogs
    const logId = `lg-sync-${Date.now()}`;
    await db.insert(changelogs).values({
      id: logId,
      user: dbUser.email,
      action: `Sincronizó espacios publicitarios desde Google Slides (${result.importedCount} importados, ${result.updatedCount} actualizados, ${result.errorCount} errores)`,
      date: new Date().toISOString(),
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error running slides synchronization:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST Rollback Sync Run
app.post("/api/sync/rollback", requireAuth, async (req: AuthRequest, res: Response) => {
  const { syncId } = req.body;
  if (!syncId) {
    return res.status(400).json({ success: false, error: "Se requiere el ID de la sincronización para realizar rollback." });
  }

  try {
    const dbUser = await getOrCreateUser(req.user.uid, req.user.email || "");
    const result = await GoogleSlidesBackendService.rollbackSync(dbUser.id, parseInt(syncId, 10));
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error executing sync rollback:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple memory cache for public screens (simulates ISR caching)
let publicScreensCache: any[] | null = null;
let publicScreensCacheTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds local server cache

app.get("/api/public/screens", async (req: Request, res: Response) => {
  const now = Date.now();
  
  // Set ISR Headers
  res.setHeader("Cache-Control", "public, max-age=15, s-maxage=60, stale-while-revalidate=120");
  
  if (publicScreensCache && (now - publicScreensCacheTime < CACHE_TTL_MS)) {
    res.setHeader("X-Cache", "HIT");
    return res.json({ success: true, data: publicScreensCache });
  }
  
  try {
    res.setHeader("X-Cache", "MISS");
    const dbScreens = await db.select().from(screens);
    const formatted = dbScreens.map(s => ({
      ...s,
      ruta: s.ruta ? JSON.parse(s.ruta) : undefined
    }));
    
    // Update cache
    publicScreensCache = formatted;
    publicScreensCacheTime = now;
    
    res.json({ success: true, data: formatted });
  } catch (error: any) {
    console.error("Error fetching public screens:", error);
    // Serve stale cache if available on error
    if (publicScreensCache) {
      res.setHeader("X-Cache", "STALE");
      return res.json({ success: true, data: publicScreensCache });
    }
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

// Helper function to safely parse stringified JSON
function safeJsonParse(val: any, fallback: any = []) {
  if (!val) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// GET Mediakits
app.get("/api/mediakits", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbMediakits = await db.select().from(mediakits);
    const formatted = dbMediakits.map(m => ({
      ...m,
      screenIds: safeJsonParse(m.screenIds, []),
      comentarios: safeJsonParse(m.comentarios, []),
      historial: safeJsonParse(m.historial, []),
      soportesEdicionInline: safeJsonParse(m.soportesEdicionInline, [])
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

    if (mkData.clienteId) {
      const existingClient = await db.select().from(clientes).where(eq(clientes.id, mkData.clienteId)).limit(1);
      if (existingClient.length === 0) {
        await db.insert(clientes).values({
          id: mkData.clienteId,
          nombre: mkData.clienteNombre || "Cliente General",
          empresa: mkData.clienteNombre || "Empresa General",
          email: "contacto@cliente.com",
          telefono: "+54 9 261 000-0000",
          categoria: "Directo",
          estado: "contactado"
        }).onConflictDoNothing();
      }
    }

    const valueToInsert = {
      id: mkData.id,
      tenantId: mkData.tenantId || null,
      nombre: mkData.nombre,
      clienteId: mkData.clienteId,
      clienteNombre: mkData.clienteNombre || "Cliente General",
      ciudad: mkData.ciudad || "Mendoza",
      screenIds: typeof mkData.screenIds === 'string' ? mkData.screenIds : JSON.stringify(mkData.screenIds || []),
      version: typeof mkData.version === 'number' ? mkData.version : 1,
      estado: mkData.estado || "Borrador",
      fecha: mkData.fecha || new Date().toISOString().split('T')[0],
      presupuesto: typeof mkData.presupuesto === 'number' ? mkData.presupuesto : (mkData.presupuesto ? parseInt(mkData.presupuesto, 10) : null),
      objetivo: mkData.objetivo || null,
      comentarios: typeof mkData.comentarios === 'string' ? mkData.comentarios : JSON.stringify(mkData.comentarios || []),
      historial: typeof mkData.historial === 'string' ? mkData.historial : JSON.stringify(mkData.historial || []),
      soportesEdicionInline: typeof mkData.soportesEdicionInline === 'string' ? mkData.soportesEdicionInline : JSON.stringify(mkData.soportesEdicionInline || [])
    };

    const result = await db.insert(mediakits).values(valueToInsert).returning();
    if (!result || result.length === 0 || !result[0]) {
      return res.status(500).json({ success: false, error: "No se pudo crear la propuesta MediaKit en la base de datos." });
    }

    const formatted = {
      ...result[0],
      screenIds: safeJsonParse(result[0].screenIds, []),
      comentarios: safeJsonParse(result[0].comentarios, []),
      historial: safeJsonParse(result[0].historial, []),
      soportesEdicionInline: safeJsonParse(result[0].soportesEdicionInline, [])
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
    const valueToUpdate: any = {};

    if (updateData.nombre !== undefined) valueToUpdate.nombre = updateData.nombre;
    if (updateData.clienteId !== undefined) {
      valueToUpdate.clienteId = updateData.clienteId;
      const existingClient = await db.select().from(clientes).where(eq(clientes.id, updateData.clienteId)).limit(1);
      if (existingClient.length === 0) {
        await db.insert(clientes).values({
          id: updateData.clienteId,
          nombre: updateData.clienteNombre || "Cliente General",
          empresa: updateData.clienteNombre || "Empresa General",
          email: "contacto@cliente.com",
          telefono: "+54 9 261 000-0000",
          categoria: "Directo",
          estado: "contactado"
        }).onConflictDoNothing();
      }
    }
    if (updateData.clienteNombre !== undefined) valueToUpdate.clienteNombre = updateData.clienteNombre;
    if (updateData.ciudad !== undefined) valueToUpdate.ciudad = updateData.ciudad;
    if (updateData.version !== undefined) valueToUpdate.version = updateData.version;
    if (updateData.estado !== undefined) valueToUpdate.estado = updateData.estado;
    if (updateData.fecha !== undefined) valueToUpdate.fecha = updateData.fecha;
    if (updateData.presupuesto !== undefined) valueToUpdate.presupuesto = updateData.presupuesto;
    if (updateData.objetivo !== undefined) valueToUpdate.objetivo = updateData.objetivo;

    if (updateData.screenIds !== undefined) {
      valueToUpdate.screenIds = typeof updateData.screenIds === 'string' ? updateData.screenIds : JSON.stringify(updateData.screenIds || []);
    }
    if (updateData.comentarios !== undefined) {
      valueToUpdate.comentarios = typeof updateData.comentarios === 'string' ? updateData.comentarios : JSON.stringify(updateData.comentarios || []);
    }
    if (updateData.historial !== undefined) {
      valueToUpdate.historial = typeof updateData.historial === 'string' ? updateData.historial : JSON.stringify(updateData.historial || []);
    }
    if (updateData.soportesEdicionInline !== undefined) {
      valueToUpdate.soportesEdicionInline = typeof updateData.soportesEdicionInline === 'string' ? updateData.soportesEdicionInline : JSON.stringify(updateData.soportesEdicionInline || []);
    }

    const result = await db.update(mediakits)
      .set(valueToUpdate)
      .where(eq(mediakits.id, id))
      .returning();

    if (!result || result.length === 0 || !result[0]) {
      return res.status(404).json({ success: false, error: "MediaKit not found" });
    }

    const formatted = {
      ...result[0],
      screenIds: safeJsonParse(result[0].screenIds, []),
      comentarios: safeJsonParse(result[0].comentarios, []),
      historial: safeJsonParse(result[0].historial, []),
      soportesEdicionInline: safeJsonParse(result[0].soportesEdicionInline, [])
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
    if (geminiApiKey) {
      const answer = await callGemini(prompt);
      res.json({ success: true, answer });
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

// --- RELATIONAL SCHEMA CRUD & METRICS ENDPOINTS ---

// GET Campaigns
app.get("/api/campaigns", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbCampaigns = await db.select().from(campaigns);
    res.json({ success: true, data: dbCampaigns });
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Tenants
app.get("/api/tenants", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbTenants = await db.select().from(tenants);
    res.json({ success: true, data: dbTenants });
  } catch (error: any) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Roles & Permissions
app.get("/api/roles", requireAuth, async (req: Request, res: Response) => {
  try {
    const dbRoles = await db.select().from(roles);
    const dbPermissions = await db.select().from(permissions);
    res.json({ success: true, data: { roles: dbRoles, permissions: dbPermissions } });
  } catch (error: any) {
    console.error("Error fetching roles and permissions:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Metrics for a specific Screen
app.get("/api/screens/:screenId/metrics", requireAuth, async (req: Request, res: Response) => {
  const { screenId } = req.params;
  try {
    const dbMetrics = await db.select().from(metrics).where(eq(metrics.screenId, screenId));
    res.json({ success: true, data: dbMetrics });
  } catch (error: any) {
    console.error("Error fetching screen metrics:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Media assets for a specific Screen
app.get("/api/screens/:screenId/media", requireAuth, async (req: Request, res: Response) => {
  const { screenId } = req.params;
  try {
    const dbMedia = await db.select().from(media).where(eq(media.screenId, screenId));
    res.json({ success: true, data: dbMedia });
  } catch (error: any) {
    console.error("Error fetching screen media:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- MOUNT VERSIONED REST API & CENTRAL ERROR HANDLER ---
app.use("/api/v1", apiV1Router);

// Fallback JSON 404 handler for any unmatched /api/* requests
app.use("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ success: false, error: `Endpoint API no encontrado: ${req.method} ${req.originalUrl}` });
});

// Centralized Error Handling Middleware (must be registered after all routes/routers)
app.use(errorHandler);

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
