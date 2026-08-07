// server.ts
import express from 'express';
import cors from 'cors';
import { db } from './src/db'; // Drizzle client
import { leads, screens } from './src/db/schema'; // Drizzle schema
import { eq, desc } from 'drizzle-orm'; // Drizzle operators
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const app = express();
app.use(express.json());
app.use(cors()); // Consider more restrictive CORS in production

// Placeholder for existing routes (e.g., AI, Google Sync, Auth)
// These would typically be imported from other modules or defined here.
// For this task, we'll just add generic handlers for /api/* that aren't leads or screens.
// This ensures existing frontend calls to these routes don't break with 404s.
app.get('/api/ai/*', (req, res) => res.status(200).json({ success: true, message: 'AI endpoint placeholder' }));
app.post('/api/ai/*', (req, res) => res.status(200).json({ success: true, message: 'AI endpoint placeholder' }));
app.get('/api/sync/*', (req, res) => res.status(200).json({ success: true, message: 'Sync endpoint placeholder' }));
app.post('/api/sync/*', (req, res) => res.status(200).json({ success: true, message: 'Sync endpoint placeholder' }));
app.get('/api/auth/*', (req, res) => res.status(200).json({ success: true, message: 'Auth endpoint placeholder' }));
app.post('/api/auth/*', (req, res) => res.status(200).json({ success: true, message: 'Auth endpoint placeholder' }));

// 6. GET /api/leads
app.get('/api/leads', async (req, res) => {
  try {
    // For a real multi-tenant app, you'd filter by tenantId here.
    // For now, fetching all leads.
    const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return res.status(200).json({ success: true, data: allLeads });
  } catch (error) {
    console.error("[API GET /api/leads]", error);
    return res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error" } });
  }
});

// 7. POST /api/leads
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Name is required and must be a non-empty string." } });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Valid email is required." } });
    }
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Message is required and must be a non-empty string." } });
    }
    if (phone && typeof phone !== 'string') {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Phone must be a string if provided." } });
    }

    const newLead = {
      id: uuidv4(), // Generate a unique ID for the lead
      // tenantId: 'default_tenant_id', // Uncomment and set if multi-tenancy is active
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedLeads = await db.insert(leads).values(newLead).returning();
    if (insertedLeads.length === 0) {
      throw new Error("Failed to insert lead into database.");
    }

    return res.status(201).json({ success: true, data: insertedLeads[0] });
  } catch (error) {
    console.error("[API POST /api/leads]", error);
    // Drizzle errors might have specific properties, but for general 500, a generic message is fine.
    return res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error during lead creation." } });
  }
});

// 8. GET /api/public/screens
app.get('/api/public/screens', async (req, res) => {
  try {
    // Assuming 'status' is a column in the screens table and 'Activo' means public/available.
    // For a real multi-tenant app, you'd filter by tenantId here.
    const publicScreens = await db.select().from(screens).where(eq(screens.status, 'Activo'));
    return res.status(200).json({ success: true, data: publicScreens });
  } catch (error) {
    console.error("[API GET /api/public/screens]", error);
    return res.status(500).json({ success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Internal server error fetching public screens." } });
  }
});

// Generic error handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "API endpoint not found." } });
});

// For Vercel serverless function, we export the app
export default app;

// For local development, listen on a port
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}