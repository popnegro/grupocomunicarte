import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import { db } from './src/db';
import { leads, screens, users, userRoles, roles } from './src/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, AuthRequest } from './src/middleware/auth';
import { apiV1Router } from './src/api/v1/router';

const app = express();
app.use(express.json());
app.use(cors());

// V1 API: canonical dashboard, inventory/spaces, campaigns, Media Kits,
// media, cities/categories, search and RBAC-protected administration.
app.use('/api/v1', apiV1Router);

// Compatibility mount for the existing PMV frontend, which still consumes
// /api/* for dashboard resources. Canonical endpoints remain available at
// /api/v1/*; this mount avoids a needless frontend rewrite during PMV closeout.
app.use('/api', apiV1Router);

// Legacy/compatibility placeholders retained for existing PMV clients.
app.all('/api/ai/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/sync/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));

// Authentication sync validates the Firebase ID token and returns the
// authoritative dashboard role from the existing PostgreSQL RBAC assignment.
// It never trusts role data supplied by the client and never changes RBAC state.
app.post('/api/auth/sync', protect, async (req: AuthRequest, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuario autenticado no identificado.' },
      });
    }

    const [dbUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);

    if (!dbUser) {
      return res.status(403).json({
        success: false,
        error: { code: 'USER_NOT_REGISTERED', message: 'No existe un usuario registrado para esta cuenta.' },
      });
    }

    const assignedRoles = await db
      .select({ slug: roles.slug })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, dbUser.id));

    const rolePriority = ['admin', 'comercial_dir', 'comercial_exec', 'ops', 'viewer'] as const;
    const assignedRoleSlugs = new Set(assignedRoles.map(({ slug }) => slug));
    const role = rolePriority.find((candidate) => assignedRoleSlugs.has(candidate)) ?? 'viewer';

    return res.status(200).json({
      success: true,
      data: { uid, role },
    });
  } catch (error) {
    console.error('[API POST /api/auth/sync]', error);
    return res.status(500).json({
      success: false,
      error: { code: 'AUTH_SYNC_ERROR', message: 'No se pudo sincronizar la identidad del usuario.' },
    });
  }
});

app.all('/api/gmail/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));

// Dashboard compatibility endpoints retained until the legacy modules are
// fully migrated to V1. They return the same envelope expected by the PMV UI
// instead of generating 404/HTML responses that break dashboard hydration.
app.get('/api/clients', protect, async (_req, res) => {
  return res.status(200).json({ success: true, data: [] });
});

app.get('/api/changelogs', protect, async (_req, res) => {
  return res.status(200).json({ success: true, data: [] });
});

app.post('/api/changelogs', protect, async (req, res) => {
  return res.status(201).json({
    success: true,
    data: {
      id: req.body?.id || uuidv4(),
      user: req.body?.user || 'Usuario',
      action: req.body?.action || 'Actividad registrada',
      date: req.body?.date || 'Justo ahora',
    },
  });
});

// Ensure Firebase Admin SDK is initialized for protected and lead flows.
import './src/lib/firebase-admin';

// GET /api/leads
app.get('/api/leads', protect, async (req: AuthRequest, res) => {
  try {
    const tenantId = req.user?.tenant_id;

    if (!tenantId) {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado: Tenant no identificado para el usuario.' } });
    }

    const allLeads = await db.select().from(leads).where(eq(leads.tenantId, tenantId)).orderBy(desc(leads.createdAt)).limit(100);
    return res.status(200).json({ success: true, data: allLeads });
  } catch (error) {
    console.error('[API GET /api/leads]', error);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Error al obtener los leads.' } });
  }
});

// POST /api/leads
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const defaultTenantId = process.env.DEFAULT_TENANT_ID;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El nombre es obligatorio.' } });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El correo electrónico no es válido.' } });
    }

    const newLead = {
      id: uuidv4(),
      tenantId: defaultTenantId || null,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message ? message.trim() : 'Sin mensaje.',
    };

    const insertedLeads = await db.insert(leads).values(newLead).returning();
    if (insertedLeads.length === 0) {
      return res.status(500).json({ success: false, error: { code: 'DB_INSERT_FAILED', message: 'No se pudo registrar el lead.' } });
    }

    try {
      const { adminDb } = await import('./src/lib/firebase-admin');
      if (adminDb) {
        await adminDb.collection('leads').doc(newLead.id).set({
          id: newLead.id,
          tenantId: newLead.tenantId,
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          message: newLead.message,
          createdAt: new Date().toISOString(),
          date: new Date().toISOString()
        });
      }
    } catch (fsErr) {
      console.warn('Backend: Failed to sync lead to Firestore:', fsErr);
    }

    return res.status(201).json({ success: true, data: insertedLeads[0] });
  } catch (error: any) {
    console.error('[API POST /api/leads]', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Este correo electrónico ya ha sido registrado.' } });
    }
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno al crear el lead.' } });
  }
});

// GET /api/public/screens
app.get('/api/public/screens', async (req, res) => {
  const defaultTenantId = process.env.DEFAULT_TENANT_ID;

  if (!defaultTenantId) {
    console.error('CRITICAL: DEFAULT_TENANT_ID is not set in environment variables.');
    return res.status(500).json({ success: false, error: { code: 'CONFIG_ERROR', message: 'Error de configuración del servidor.' } });
  }

  try {
    const publicScreens = await db
      .select()
      .from(screens)
      .where(and(eq(screens.tenantId, defaultTenantId), eq(screens.status, 'Activo')));

    return res.status(200).json({ success: true, data: publicScreens });
  } catch (error) {
    console.error('[API GET /api/public/screens]', error);
    return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Error al obtener las pantallas públicas.' } });
  }
});

// Public PMV funnel: prospects can request a Media Kit without authenticating.
// Availability is revalidated against the canonical tenant inventory server-side.
app.post('/api/mediakit/request', async (req, res) => {
  try {
    const body = req.body ?? {};
    const lead = body.lead ?? {};
    const selectedIds = Array.isArray(body.selectedIds)
      ? Array.from(new Set(body.selectedIds.filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)))
      : [];
    const name = typeof lead.name === 'string' ? lead.name.trim() : '';
    const email = typeof lead.email === 'string' ? lead.email.trim() : '';
    const company = typeof lead.company === 'string' ? lead.company.trim() : '';
    const phone = typeof lead.phone === 'string' ? lead.phone.trim() : '';
    const message = typeof lead.message === 'string' ? lead.message.trim() : '';
    const defaultTenantId = process.env.DEFAULT_TENANT_ID || null;

    if (name.length < 2) return res.status(400).json({ status: 'error', message: 'Ingresá tu nombre completo.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ status: 'error', message: 'Ingresá un correo electrónico válido.' });
    if (selectedIds.length === 0) return res.status(400).json({ status: 'error', message: 'Seleccioná al menos un soporte.' });
    if (!defaultTenantId) return res.status(500).json({ status: 'error', message: 'Error de configuración del servidor.' });

    const selectedScreens = await db
      .select({ id: screens.id, status: screens.status })
      .from(screens)
      .where(and(eq(screens.tenantId, defaultTenantId), inArray(screens.id, selectedIds)));

    const availableIds = new Set(
      selectedScreens
        .filter((screen) => String(screen.status).toLowerCase() === 'activo')
        .map((screen) => screen.id)
    );
    const unavailableIds = selectedIds.filter((id) => !availableIds.has(id));

    if (selectedScreens.length !== selectedIds.length || unavailableIds.length > 0) {
      return res.status(400).json({
        status: 'availability_conflict',
        message: 'Uno o más soportes seleccionados ya no están disponibles para reserva inmediata.',
        unavailableIds,
      });
    }

    const year = new Date().getFullYear();
    const sequence = String(Date.now()).slice(-4);
    const suffix = uuidv4().replace(/-/g, '').slice(0, 4).toUpperCase();
    const requestId = `REQ-${year}-${sequence}-${suffix}`;
    const leadMessage = [
      `Solicitud de Media Kit ${requestId}`,
      `Soportes: ${selectedIds.join(', ')}`,
      company ? `Empresa: ${company}` : '',
      phone ? `Teléfono: ${phone}` : '',
      message ? `Observaciones: ${message}` : '',
    ].filter(Boolean).join('\n');

    const inserted = await db.insert(leads).values({
      id: requestId,
      tenantId: defaultTenantId,
      name,
      email,
      phone: phone || null,
      message: leadMessage,
    }).returning();

    if (!inserted.length) return res.status(500).json({ status: 'error', message: 'No se pudo registrar la solicitud.' });

    return res.status(201).json({ status: 'success', requestId, data: inserted[0] });
  } catch (error) {
    console.error('[API POST /api/mediakit/request]', error);
    return res.status(500).json({ status: 'error', message: 'Error interno al registrar la solicitud.' });
  }
});

// Generic error handler for unmatched /api routes.
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `El endpoint ${req.method} ${req.originalUrl} no fue encontrado.` } });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}

if (!process.env.VERCEL) startServer();

export default app;
