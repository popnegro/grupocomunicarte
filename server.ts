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

const app = express();
app.use(express.json());
app.use(cors()); // Consider more restrictive CORS in production

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
    const { name, email, phone, message } = req.body;
    const defaultTenantId = process.env.DEFAULT_TENANT_ID;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "El nombre es obligatorio." } });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "El correo electrónico no es válido." } });
    }

    const newLead = {
      id: uuidv4(),
      tenantId: defaultTenantId || null, // Associate with default tenant or null
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message ? message.trim() : "Sin mensaje.",
    };

    const insertedLeads = await db.insert(leads).values(newLead).returning();
    if (insertedLeads.length === 0) {
      return res.status(500).json({ success: false, error: { code: "DB_INSERT_FAILED", message: "No se pudo registrar el lead." } });
    }

    return res.status(201).json({ success: true, data: insertedLeads[0] });
  } catch (error: any) {
    console.error("[API POST /api/leads]", error);
    if (error.code === '23505') { // PostgreSQL unique violation
        return res.status(409).json({ success: false, error: { code: "CONFLICT", message: "Este correo electrónico ya ha sido registrado." } });
    }
    return res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Error interno al crear el lead." } });
  }
});

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

// Generic error handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: `El endpoint ${req.method} ${req.originalUrl} no fue encontrado.` } });
});

async function startServer() {
  if (process.env.NODE_ENV === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', (req, res) => {
      const url = req.originalUrl;
      const html = `... Vite development server HTML ...`; // Placeholder
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;