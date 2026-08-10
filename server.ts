import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import { db } from './src/db/index';
import { leads, screens, clientes, mediakits, changelogs } from './src/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, AuthRequest } from './src/middleware/auth'; // Import the protect middleware and AuthRequest type
import { validateSpaceDTO } from './src/validation/validator';
import { MediaRepository } from './src/repositories/index';
import { getGalleryMedia, sortFeaturedScreens } from './src/utils/screenMedia';

const isVercel = process.env.VERCEL === '1';
const allowedOrigin = process.env.CORS_ORIGIN;

const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigin || true,
  credentials: Boolean(allowedOrigin),
}));


// Ensure Firebase Admin SDK is initialized
import './src/lib/firebase-admin';

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

// 8. GET /api/public/screens
// SECURITY: Public inventory must use an explicit projection. The `screens` table
// contains commercial fields such as `precio` that must never cross the public API boundary.
app.get('/api/public/screens', async (req, res) => {
  const defaultTenantId = process.env.DEFAULT_TENANT_ID;

  if (!defaultTenantId) {
    console.error('CRITICAL: DEFAULT_TENANT_ID is not set in environment variables.');
    return res.status(500).json({ success: false, error: { code: "CONFIG_ERROR", message: "Error de configuración del servidor." } });
  }

  try {
    const publicScreens = await db
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
        isFeatured: screens.isFeatured,
        featuredOrder: screens.featuredOrder,
        createdAt: screens.createdAt,
        updatedAt: screens.updatedAt,
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
    if (!body.nombre || typeof body.nombre !== 'string') {
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
    const { tenantId: _, ...updateData } = req.body;
    const validatedData = validateSpaceDTO(updateData);
    const sanitizedData = Object.keys(updateData).reduce((acc, key) => ({ ...acc, [key]: (validatedData as any)[key] }), {});
    const finalPayload = {
      ...sanitizedData,
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
    const newClient = { id: uuidv4(), tenantId, nombre, empresa, email, telefono: req.body.telefono || null, categoria: req.body.categoria || null };
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
    const updated = await db.update(clientes).set({ ...updateData, updatedAt: new Date() }).where(and(eq(clientes.id, req.params.id), eq(clientes.tenantId, tenantId))).returning();
    if (updated.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Cliente no encontrado." } });
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[API PUT /api/clients/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al actualizar el cliente." } });
  }
});

app.delete('/api/clients/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const deleted = await db.delete(clientes).where(and(eq(clientes.id, req.params.id), eq(clientes.tenantId, tenantId))).returning();
    if (deleted.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Cliente no encontrado." } });
    return res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error("[API DELETE /api/clients/:id]", error);
    return res.status(200).json({ success: true, data: null });
  }
});

// MediaKit CRUD
app.get('/api/mediakits', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const rows = await db.select().from(mediakits).where(eq(mediakits.tenantId, tenantId)).orderBy(desc(mediakits.updatedAt));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/mediakits]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener los MediaKits." } });
  }
});

app.get('/api/mediakits/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const rows = await db.select().from(mediakits).where(and(eq(mediakits.id, req.params.id), eq(mediakits.tenantId, tenantId))).limit(1);
    if (rows.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "MediaKit no encontrado." } });
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("[API GET /api/mediakits/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener el MediaKit." } });
  }
});

app.post('/api/mediakits', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const body = req.body ?? {};
    const newMediaKit = { id: body.id || uuidv4(), tenantId, ...body, updatedAt: new Date() };
    const inserted = await db.insert(mediakits).values(newMediaKit).returning();
    return res.status(201).json({ success: true, data: inserted[0] });
  } catch (error) {
    console.error("[API POST /api/mediakits]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al crear el MediaKit." } });
  }
});

app.put('/api/mediakits/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const { tenantId: _, ...updateData } = req.body;
    const updated = await db.update(mediakits).set({ ...updateData, updatedAt: new Date() }).where(and(eq(mediakits.id, req.params.id), eq(mediakits.tenantId, tenantId))).returning();
    if (updated.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "MediaKit no encontrado." } });
    return res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("[API PUT /api/mediakits/:id]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al actualizar el MediaKit." } });
  }
});

app.delete('/api/mediakits/:id', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const deleted = await db.delete(mediakits).where(and(eq(mediakits.id, req.params.id), eq(mediakits.tenantId, tenantId))).returning();
    if (deleted.length === 0) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "MediaKit no encontrado." } });
    return res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error("[API DELETE /api/mediakits/:id]", error);
    return res.status(200).json({ success: true, data: null });
  }
});

// GET /api/changelog
app.get('/api/changelog', protect, async (req: AuthRequest, res) => {
  const tenantId = req.user?.tenant_id;
  if (!tenantId) return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Acceso denegado: Tenant no identificado." } });
  try {
    const rows = await db.select().from(changelogs).orderBy(desc(changelogs.date)).limit(100);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("[API GET /api/changelog]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener el historial." } });
  }
});

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  if (isVercel) return;
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.join(process.cwd(), 'dist', 'index.html')));
    app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
    return;
  }
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
  app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
