import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';

import { db } from './src/db';
import { leads, screens } from './src/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, AuthRequest } from './src/middleware/auth'; // Import the protect middleware and AuthRequest type

const isVercel = process.env.VERCEL === '1';
const allowedOrigin = process.env.CORS_ORIGIN;

const app = express();
app.use(express.json());
app.use(cors({
  origin: allowedOrigin || true,
  credentials: Boolean(allowedOrigin),
}));

// Placeholder for existing routes (e.g., AI, Google Sync, Auth)
// These are generic handlers to prevent 404s for routes not explicitly defined yet.
app.all('/api/ai/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/sync/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/auth/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));
app.all('/api/gmail/*', (req, res) => res.status(200).json({ success: true, message: `${req.method} ${req.originalUrl} placeholder` }));

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
app.get('/api/public/screens', async (req, res) => {
  const defaultTenantId = process.env.DEFAULT_TENANT_ID;

  if (!defaultTenantId) {
    console.error('CRITICAL: DEFAULT_TENANT_ID is not set in environment variables.');
    return res.status(500).json({ success: false, error: { code: "CONFIG_ERROR", message: "Error de configuración del servidor." } });
  }

  try {
    const publicScreens = await db
      .select()
      .from(screens)
      .where(and(
        eq(screens.tenantId, defaultTenantId),
        eq(screens.status, 'Activo')
      ));

    return res.status(200).json({ success: true, data: publicScreens });
  } catch (error) {
    console.error("[API GET /api/public/screens]", error);
    return res.status(500).json({ success: false, error: { code: "DB_ERROR", message: "Error al obtener las pantallas públicas." } });
  }
});

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