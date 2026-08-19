import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import { db } from './src/db';
import { leads, screens } from './src/db/schema';
import { eq, desc, and } from 'drizzle-orm';
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
app.all('/api/auth/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
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
