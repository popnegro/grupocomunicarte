import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import { db } from './src/db/index';
import { apiV1Router } from './src/api/v1/router';
import { leads, screens, clientes, mediakits, changelogs } from './src/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, AuthRequest } from './src/middleware/auth'; // Import the protect middleware and AuthRequest type
import { validateSpaceDTO } from './src/validation/validator';
import { MediaRepository } from './src/repositories/index';
import { getGalleryMedia } from './src/utils/screenMedia';

const isVercel = process.env.VERCEL === '1';
const allowedOrigin = process.env.CORS_ORIGIN;

const app = express();
app.use(express.json());
app.use(cors({
  // @ts-ignore
  origin: allowedOrigin || true,
  credentials: Boolean(allowedOrigin),
}));


// Ensure Firebase Admin SDK is initialized
import './src/lib/firebase-admin';

// Mount the v1 API router
app.use('/api/v1', apiV1Router);

// GET /api/leads
app.get('/api/leads', protect, async (req: AuthRequest, res) => { // Apply protect middleware
  try {
    const tenantId = req.user?.tenant_id; // Get tenantId from authenticated user's decoded token

    if (!tenantId) {
      // This should ideally not happen if Firebase custom claims are set up correctly
      // or if a user-tenant mapping is done after token verification.
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado para el usuario." } });
    }

    const allLeads = await db.select().from(leads).where(eq(leads.tenantId, tenantId)).orderBy(desc(leads.createdAt)).limit(100);
    return res.status(200).json({ success: true, data: allLeads });
  } catch (error) {
    console.error("[API GET /api/leads]", error);
    return res.status(500).json({
      success: false,
      error: { code: "DB_ERROR", message: "Error al obtener los leads." }
    });
  }
});

// 7. POST /api/leads
app.post('/api/leads', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      source = 'Formulario Web',
      status = 'new',
      value = 0,
    } = req.body ?? {};
    const defaultTenantId = process.env.DEFAULT_TENANT_ID;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El nombre es obligatorio.' } });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El correo electrónico no es válido.' } });
    }
    if (company !== undefined && typeof company !== 'string') {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'La empresa no es válida.' } });
    }

    const normalizedStatus = ['new', 'contacted', 'qualified', 'closed'].includes(status) ? status : 'new';
    const numericValue = Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;
    const normalizedMessage = typeof message === 'string' && message.trim()
      ? message.trim()
      : 'Consulta comercial desde el sitio web.';

    const newLead = {
      id: uuidv4(),
      tenantId: defaultTenantId || null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
      company: typeof company === 'string' && company.trim() ? company.trim() : null,
      message: normalizedMessage,
      source: typeof source === 'string' && source.trim() ? source.trim() : 'Formulario Web',
      status: normalizedStatus,
      value: numericValue,
    };

    const insertedLeads = await db.insert(leads).values(newLead).returning();
    if (insertedLeads.length === 0) {
      return res.status(500).json({ success: false, error: { code: 'DB_INSERT_FAILED', message: 'No se pudo registrar el lead.' } });
    }

    // Sync to Firestore under centralized management (safe wrap)
    try {
      const { adminDb } = await import('./src/lib/firebase-admin');
      if (adminDb) {
        await adminDb.collection('leads').doc(newLead.id).set({
          ...newLead,
          createdAt: new Date().toISOString(),
          date: new Date().toISOString(),
        });
      }
    } catch (fsErr) {
      console.warn('Backend: Failed to sync lead to Firestore:', fsErr);
    }

    // Notify the commercial team when Resend is configured. Notification failure
    // must never turn a successfully persisted lead into a failed request.
    let notificationSent = false;
    const resendApiKey = process.env.RESEND_API_KEY;
    const salesNotifyEmail = process.env.SALES_NOTIFY_EMAIL;
    if (resendApiKey && salesNotifyEmail) {
      try {
        const subject = `Nuevo lead: ${newLead.name} — ${newLead.source}`;
        const html = `
          <h2>Nuevo lead comercial</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(newLead.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(newLead.email)}</p>
          <p><strong>Empresa:</strong> ${escapeHtml(newLead.company || '—')}</p>
          <p><strong>Fuente:</strong> ${escapeHtml(newLead.source)}</p>
          <p><strong>Estado:</strong> ${escapeHtml(newLead.status)}</p>
          <p><strong>Valor estimado:</strong> $${newLead.value.toLocaleString('es-AR')}</p>
          <hr />
          <p><strong>Detalle:</strong></p>
          <p>${escapeHtml(newLead.message).replace(/\n/g, '<br />')}</p>
        `;
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [salesNotifyEmail],
            subject,
            html,
          }),
        });
        notificationSent = resendResponse.ok;
        if (!resendResponse.ok) {
          console.warn('[API POST /api/leads] Resend notification failed:', await resendResponse.text());
        }
      } catch (notifyErr) {
        console.warn('[API POST /api/leads] Resend notification error:', notifyErr);
      }
    }

    return res.status(201).json({
      success: true,
      data: insertedLeads[0],
      meta: { notificationSent },
    });
  } catch (error: any) {
    console.error('[API POST /api/leads]', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Este correo electrónico ya ha sido registrado.' } });
    }
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno al crear el lead.' } });
  }
});

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// The public API response for a screen should not include the price.
// This DTO must accurately reflect the nullability of the `screens` table in schema.ts
type PublicDoohScreen = {
  id: string;
  tenantId: string | null;
  nombre: string;
  zona: string | null;
  tipo: string | null;
  categoria: string | null;
  ciudad: string;
  impactos: number | null;
  status: string;
  dimensiones: string | null;
  brillo: string | null;
  refreshRate: string | null;
  formato: string | null;
  cobertura: string | null;
  ruta: string | null;
  lat: number | null;
  lng: number | null;
  nota: string | null;
  video: string | null; // This was the source of the type mismatch. It should be `string | null` to match the DB schema and select statement.
  horarios: string | null;
  isFeatured: boolean;
  featuredOrder: number | null;
  media?: any[]; // Added for the final response structure
};

function sortFeaturedScreens(screens: PublicDoohScreen[], total: number): PublicDoohScreen[] {
  const featured = screens.filter(s => s.isFeatured && typeof s.featuredOrder === 'number');
  const nonFeatured = screens.filter(s => !s.isFeatured || typeof s.featuredOrder !== 'number');

  featured.sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));

  const combined = [...featured, ...nonFeatured];
  return combined.slice(0, total);
}

// 8. GET /api/public/screens
app.get('/api/public/screens', async (req, res) => {
  const defaultTenantId = process.env.DEFAULT_TENANT_ID;

  if (!defaultTenantId) {
    console.error('CRITICAL: DEFAULT_TENANT_ID is not set in environment variables.');
    return res.status(500).json({ success: false, error: { code: "CONFIG_ERROR", message: "Error de configuración del servidor." } });
  }

  try {
    // Explicitly select columns to omit 'precio' for the public endpoint
    const publicScreens: PublicDoohScreen[] = await db
      .select({
        id: screens.id,
        tenantId: screens.tenantId,
        nombre: screens.nombre,
        zona: screens.zona,
        tipo: screens.tipo,
        categoria: screens.categoria,
        ciudad: screens.ciudad,
        impactos: screens.impactos,
        status: screens.status,
        dimensiones: screens.dimensiones,
        brillo: screens.brillo,
        refreshRate: screens.refreshRate,
        formato: screens.formato,
        cobertura: screens.cobertura,
        ruta: screens.ruta,
        lat: screens.lat,
        lng: screens.lng,
        nota: screens.nota,
        video: screens.video,
        horarios: screens.horarios,
        syncId: screens.syncId,
        hash: screens.hash,
        createdAt: screens.createdAt,
        updatedAt: screens.updatedAt,
        isFeatured: screens.isFeatured,
        featuredOrder: screens.featuredOrder,
      })
      .from(screens)
      .where(and(
        eq(screens.tenantId, defaultTenantId),
        or(eq(screens.status, 'Activo'), eq(screens.status, 'Disponible'))
      ));

    const orderedScreens = sortFeaturedScreens(publicScreens, publicScreens.length);
    const screensWithMedia = await Promise.all(
      orderedScreens.map(async (screen) => ({
        ...screen,
        media: [
          ...getGalleryMedia(screen),
          ...(await MediaRepository.findByScreenId(screen.id)),
        ],
      }))
    );

    return res.status(200).json({ success: true, data: screensWithMedia });
  } catch (error) {
    console.error("[API GET /api/public/screens]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener las pantallas públicas." } });
  }
});

// 9. CRUD /api/screens
app.get('/api/screens', protect, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user?.tenant_id || process.env.DEFAULT_TENANT_ID;
    let query = db.select().from(screens);
    if (tenantId) {
      query = query.where(eq(screens.tenantId, tenantId)) as any;
    }
    const rows = await query.orderBy(desc(screens.updatedAt));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/screens]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener los soportes." } });
  }
});

app.post('/api/screens', protect, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user?.tenant_id || process.env.DEFAULT_TENANT_ID || null;
    const body = req.body ?? {};
    if (!body.nombre || typeof body.nombre !== "string") {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "El nombre del soporte es obligatorio." } });
    }

    const newScreen = {
      id: body.id || uuidv4(),
      tenantId,
      ...body,
      isFeatured: body.isFeatured === true || body.isFeatured === "true",
      featuredOrder: body.featuredOrder === undefined || body.featuredOrder === null || body.featuredOrder === "" ? null : Number(body.featuredOrder),
      updatedAt: new Date(),
    };

    const inserted = await db.insert(screens).values(newScreen).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error("[API POST /api/screens]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al crear el soporte." } });
  }
});

app.put('/api/screens/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) {
    return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  }

  try {
    // Do not allow tenantId to be changed from the body
    const { tenantId: _, ...updateData } = req.body;

    // Validate and sanitize the incoming partial data.
    // The validator is adjusted to not require all fields for an update.
    // It will throw on invalid data types.
    const validatedData = validateSpaceDTO(updateData);

    // We only want to set the fields that were actually passed in the body.
    // The validator returns a full object, so we filter it.
    const sanitizedData = Object.keys(updateData).reduce((acc, key) => ({ ...acc, [key]: (validatedData as any)[key] }), {});
    const finalPayload = {
      ...updateData,
      updatedAt: new Date(),
    };

    const updated = await db
      .update(screens)
      .set(finalPayload)
      .where(and(eq(screens.id, req.params.id), eq(screens.tenantId, tenantId)))
      .returning();

    if (updated.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Soporte no encontrado o sin permisos para actualizar." } });
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[API PUT /api/screens/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al actualizar el soporte." } });
  }
});

app.delete('/api/screens/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) {
    return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  }

  try {
    const deleted = await db.delete(screens).where(and(eq(screens.id, req.params.id), eq(screens.tenantId, tenantId))).returning();
    if (deleted.length === 0) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Soporte no encontrado o sin permisos para eliminar." } });
    }
    return res.status(200).json({ success: true, data: deleted[0] || null });
  } catch (error) {
    console.error("[API DELETE /api/screens/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al eliminar el soporte." } });
  }
});

// CRUD /api/clients
app.get('/api/clients', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const rows = await db.select().from(clientes).where(eq(clientes.tenantId, tenantId)).orderBy(desc(clientes.createdAt));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/clients]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener los clientes." } });
  }
});

app.post('/api/clients', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const { nombre, empresa, email } = req.body;
    if (!nombre || !empresa || !email) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Nombre, empresa y email son obligatorios." } });
    }
    const newClient = { id: uuidv4(), tenantId, ...req.body };
    const inserted = await db.insert(clientes).values(newClient).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error("[API POST /api/clients]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al crear el cliente." } });
  }
});

app.put('/api/clients/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const { tenantId: _, ...updateData } = req.body;
    const finalPayload = { ...updateData, updatedAt: new Date() };
    const updated = await db.update(clientes).set(finalPayload).where(and(eq(clientes.id, req.params.id), eq(clientes.tenantId, tenantId))).returning();
    if (updated.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Cliente no encontrado o sin permisos para actualizar." } });
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[API PUT /api/clients/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al actualizar el cliente." } });
  }
});

// CRUD /api/mediakits
app.get('/api/mediakits', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const rows = await db.select().from(mediakits).where(eq(mediakits.tenantId, tenantId)).orderBy(desc(mediakits.createdAt));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/mediakits]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener los media kits." } });
  }
});

app.post('/api/mediakits', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "El nombre del media kit es obligatorio." } });
    }
    const newMediaKit = { id: uuidv4(), tenantId, ...req.body };
    const inserted = await db.insert(mediakits).values(newMediaKit).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error("[API POST /api/mediakits]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al crear el media kit." } });
  }
});

app.put('/api/mediakits/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const { tenantId: _, ...updateData } = req.body;
    const finalPayload = { ...updateData, updatedAt: new Date() };
    const updated = await db.update(mediakits).set(finalPayload).where(and(eq(mediakits.id, req.params.id), eq(mediakits.tenantId, tenantId))).returning();
    if (updated.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Media kit no encontrado o sin permisos para actualizar." } });
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[API PUT /api/mediakits/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al actualizar el media kit." } });
  }
});

app.delete('/api/mediakits/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const deleted = await db.delete(mediakits).where(and(eq(mediakits.id, req.params.id), eq(mediakits.tenantId, tenantId))).returning();
    if (deleted.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Media kit no encontrado o sin permisos para eliminar." } });
    return res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error("[API DELETE /api/mediakits/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al eliminar el media kit." } });
  }
});

// CRUD /api/changelogs
app.get('/api/changelogs', protect, async (req: AuthRequest, res) => {
  // Note: changelogs table does not have tenantId, this is a global log for now.
  // In a real multi-tenant system, this would need a tenantId column.
  try {
    const rows = await db.select().from(changelogs).orderBy(desc(changelogs.date)).limit(100);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/changelogs]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener los registros de cambios." } });
  }
});

app.post('/api/changelogs', protect, async (req: AuthRequest, res) => {
  try {
    const { user, action } = req.body;
    if (!user || !action) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Usuario y acción son obligatorios." } });
    }
    const newLog = {
      id: `log-${uuidv4()}`,
      user,
      action,
      date: new Date().toISOString(),
    };
    const inserted = await db.insert(changelogs).values(newLog).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error("[API POST /api/changelogs]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al crear el registro de cambios." } });
  }
});

// Placeholder for other routes to prevent 404s for routes not explicitly defined yet.
app.all('/api/ai/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/sync/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/auth/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/gmail/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));

// Lightweight production health endpoint. It reports configuration readiness
// without exposing secret values or database credentials.
app.get('/api/health', (_req, res) => {
  const checks = {
    database: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
    tenant: Boolean(process.env.DEFAULT_TENANT_ID),
    firebase: Boolean(process.env.FIREBASE_PROJECT_ID),
    resend: Boolean(process.env.RESEND_API_KEY && process.env.SALES_NOTIFY_EMAIL),
  };
  const ready = checks.database && checks.tenant && checks.firebase;
  return res.status(ready ? 200 : 503).json({
    success: ready,
    environment: process.env.VERCEL === '1' ? 'vercel' : 'node',
    checks,
  });
});

// Generic error handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: `El endpoint ${req.method} ${req.originalUrl} no fue encontrado.` } });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000; // Hardcoded port 3000 required by the infrastructure proxy
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
