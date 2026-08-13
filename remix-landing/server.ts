import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DBService } from './server/db.service.js';
import { signToken, verifyToken } from './server/jwt.service.js';
import { hashPassword, verifyPassword } from './server/crypto.service.js';
import { Support, UserRole, UserSession, SupportType, SupportPlaza, LeadStatus } from './src/types/index.js';

// Setup basic Express app
const app = express();
const PORT = 3000;

app.use(express.json());

// --- INITIAL ADMINISTRATOR BOOTSTRAP CONFIGURATION ---
const SUPERADMIN_EMAIL = process.env.INITIAL_SUPERADMIN_EMAIL || 'superadmin@grupocomunicarte.com';
const SUPERADMIN_PASSWORD_PLAIN = process.env.INITIAL_SUPERADMIN_PASSWORD || 'supercomunicarte2026!';

const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL || 'admin@grupocomunicarte.com';
const ADMIN_PASSWORD_PLAIN = process.env.INITIAL_ADMIN_PASSWORD || 'admincomunicarte2026!';

// Validate initial credentials length (Minimum 12 characters policy)
if (SUPERADMIN_PASSWORD_PLAIN.length < 12 || ADMIN_PASSWORD_PLAIN.length < 12) {
  console.error("CRITICAL CONFIGURATION ERROR: Las contraseñas iniciales de administración deben tener un mínimo de 12 caracteres.");
  process.exit(1);
}

// Immediately compute the cryptographic hashes and discard plaintexts
const SUPERADMIN_HASH = hashPassword(SUPERADMIN_PASSWORD_PLAIN);
const ADMIN_HASH = hashPassword(ADMIN_PASSWORD_PLAIN);

// --- LIGHTWEIGHT IN-MEMORY RATE LIMITER MIDDLEWARE ---
const rateLimitRegistry = new Map<string, { count: number; firstRequestTime: number }>();
const rateLimiter = (options: { windowMs: number; max: number; message: string }) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitRegistry.get(ip);

    if (!record) {
      rateLimitRegistry.set(ip, { count: 1, firstRequestTime: now });
      return next();
    }

    if (now - record.firstRequestTime > options.windowMs) {
      record.count = 1;
      record.firstRequestTime = now;
      return next();
    }

    record.count += 1;
    if (record.count > options.max) {
      return res.status(429).json({ error: options.message });
    }

    next();
  };
};

// --- SECURITY HEADERS MIDDLEWARE ---
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Required to render correctly in AI Studio iFrame preview
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// --- CUSTOM CORS MIDDLEWARE ---
app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || 'https://ais-dev-dmg4k7acl3btczc3lu3fpq-175390492626.us-east1.run.app';
  const origin = req.headers.origin;
  if (process.env.NODE_ENV !== 'production') {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  } else {
    if (origin === allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware to authorize endpoints based on administrative roles
const authenticateToken = (allowedRoles: UserRole[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado: Token de sesión faltante.' });
    }

    try {
      const session = verifyToken(token) as UserSession | null;

      if (!session || !session.role || !allowedRoles.includes(session.role)) {
        return res.status(403).json({ error: 'Permisos insuficientes para realizar esta operación.' });
      }

      // Attach session to request
      req.user = session;
      next();
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific JWT errors like TokenExpiredError
        return res.status(403).json({ error: `Sesión inválida o expirada: ${error.message}` });
      }
      return res.status(403).json({ error: 'Sesión inválida o expirada.' });
    }
  };
};

type SessionPayload = Omit<UserSession, 'uid'>;

// --- AUTHENTICATION ENDPOINTS ---
app.post('/api/auth/login', rateLimiter({ windowMs: 60000, max: 10, message: 'Demasiados intentos de inicio de sesión. Por favor intente más tarde.' }), (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Formato de credenciales de acceso inválido.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === SUPERADMIN_EMAIL.toLowerCase()) {
    if (verifyPassword(password, SUPERADMIN_HASH)) {
      const user = {
        uid: 'sa1',
        email: SUPERADMIN_EMAIL,
        name: 'Director General',
        role: 'SúperAdmin'
      };
      const token = signToken(user);
      return res.json({ token, user });
    }
  } else if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
    if (verifyPassword(password, ADMIN_HASH)) {
      const user = {
        uid: 'a1',
        email: ADMIN_EMAIL,
        name: 'Operador Comercial',
        role: 'Admin'
      } as SessionPayload;
      const token = signToken(user);
      return res.json({ token, user });
    }
  }

  return res.status(400).json({ error: 'Credenciales inválidas. Por favor intente nuevamente con las credenciales de demostración seguras.' });
});

// --- INVENTORY ENDPOINTS ---
app.get('/api/inventory', (req, res) => {
  try {
    const supports = DBService.getSupports();
    res.json(supports);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al consultar el inventario de soportes.',
      details: message 
    });
  }
});

app.post('/api/inventory', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const { name, plaza, type, address, latitude, longitude, description, size, imageUrl, refPoints, contactsCount } = req.body;
    
    if (!name || !plaza || !type || !address || latitude === undefined || longitude === undefined || !description || !size || !imageUrl) {
      return res.status(400).json({ error: 'Todos los campos obligatorios del soporte deben ser provistos.' });
    }

    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 150) {
      return res.status(400).json({ error: 'Nombre comercial inválido (hasta 150 caracteres).' });
    }

    const validPlazas: SupportPlaza[] = ['Mendoza', 'Buenos Aires'];
    if (!validPlazas.includes(plaza)) {
      return res.status(400).json({ error: 'Plaza inválida. Debe ser Mendoza o Buenos Aires.' });
    }

    const validTypes: SupportType[] = ['Soportes Tradicionales', 'Pantallas LED', 'LED Móvil'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Categoría de soporte inválida.' });
    }

    if (typeof address !== 'string' || address.trim().length === 0 || address.length > 200) {
      return res.status(400).json({ error: 'Dirección física inválida (hasta 200 caracteres).' });
    }

    if (typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({ error: 'Latitud debe ser un número válido entre -90 y 90.' });
    }

    if (typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Longitud debe ser un número válido entre -180 y 180.' });
    }

    if (typeof description !== 'string' || description.trim().length === 0 || description.length > 1000) {
      return res.status(400).json({ error: 'Descripción comercial inválida (hasta 1000 caracteres).' });
    }

    if (typeof size !== 'string' || size.trim().length === 0 || size.length > 50) {
      return res.status(400).json({ error: 'Tamaño/Dimensiones inválido.' });
    }

    if (typeof imageUrl !== 'string' || imageUrl.trim().length === 0 || imageUrl.length > 500) {
      return res.status(400).json({ error: 'URL de imagen de portada inválida.' });
    }

    // Process optional fields
    let processedRefPoints: string[] = [];
    if (refPoints) {
      if (Array.isArray(refPoints)) {
        processedRefPoints = refPoints.filter(item => typeof item === 'string').map(item => item.trim());
      } else if (typeof refPoints === 'string') {
        processedRefPoints = refPoints.split(',').map(item => item.trim()).filter(item => item.length > 0);
      }
    }

    const newSupport = DBService.addSupport({
      name: name.trim(),
      plaza: plaza,
      type: type,
      address: address.trim(),
      latitude,
      longitude,
      description: description.trim(),
      size: size.trim(),
      imageUrl: imageUrl.trim(),
      videoUrl: req.body.videoUrl ? String(req.body.videoUrl).trim() : undefined,
      refPoints: processedRefPoints,
      contactsCount: contactsCount ? String(contactsCount).trim() : 'Bajo cotización',
      status: 'available'
    });
    res.status(201).json(newSupport);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al guardar el nuevo soporte publicitario.',
      details: message
    });
  }
});

app.put('/api/inventory/:id', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const { name, plaza, type, address, latitude, longitude, description, size, imageUrl, refPoints, contactsCount } = req.body;
    
    // Validate types of updated fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ error: 'Nombre comercial inválido.' });
    }
    const validPlazas: SupportPlaza[] = ['Mendoza', 'Buenos Aires'];
    if (plaza !== undefined && !validPlazas.includes(plaza)) {
      return res.status(400).json({ error: 'Plaza inválida.' });
    }
    const validTypes: SupportType[] = ['Soportes Tradicionales', 'Pantallas LED', 'LED Móvil'];
    if (type !== undefined && !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Categoría de soporte inválida.' });
    }
    if (latitude !== undefined && (typeof latitude !== 'number' || isNaN(latitude) || latitude < -90 || latitude > 90)) {
      return res.status(400).json({ error: 'Latitud inválida.' });
    }
    if (longitude !== undefined && (typeof longitude !== 'number' || isNaN(longitude) || longitude < -180 || longitude > 180)) {
      return res.status(400).json({ error: 'Longitud inválida.' });
    }

    const updated = DBService.updateSupport(req.params.id, req.body as Partial<Support>);
    res.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al actualizar el soporte publicitario.',
      details: message
    });
  }
});

app.delete('/api/inventory/:id', authenticateToken(['SúperAdmin']), (req, res) => {
  try {
    const success = DBService.deleteSupport(req.params.id);
    if (success) {
      res.json({ success: true, message: 'Soporte publicitario eliminado correctamente.' });
    } else {
      res.status(404).json({ error: 'Soporte no encontrado.' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al eliminar el soporte publicitario del sistema.',
      details: message
    });
  }
});

// --- HEALTH CHECK ENDPOINT ---
app.get('/health', (req, res) => {
  try {
    const supports = DBService.getSupports();
    const dbStatus = Array.isArray(supports) ? 'ok' : 'error';
    res.json({
      status: 'ok',
      application: 'ok',
      database: dbStatus
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      application: 'ok',
      database: 'error'
    });
  }
});

// --- LEADS & QUOTES ENDPOINTS ---
app.post('/api/leads', rateLimiter({ windowMs: 60000, max: 5, message: 'Demasiadas solicitudes enviadas desde esta dirección. Por favor intente más tarde.' }), (req, res) => {
  try {
    const { name, company, email, phone, message, selectedSupportIds, plazaContext, campaignStartDate, campaignEndDate } = req.body;
    
    // 1. Mandatory Fields Check
    if (!name || !email || !phone || !selectedSupportIds || selectedSupportIds.length === 0) {
      return res.status(400).json({ error: 'Campos requeridos faltantes para completar la solicitud de cotización.' });
    }

    // 2. Format & Type Checks
    if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
      return res.status(400).json({ error: 'Nombre inválido (debe ser una cadena de texto de hasta 100 caracteres).' });
    }
    
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) {
      return res.status(400).json({ error: 'Dirección de correo electrónico inválida.' });
    }

    if (typeof phone !== 'string' || phone.trim().length < 5 || phone.length > 30) {
      return res.status(400).json({ error: 'Número de teléfono inválido.' });
    }

    if (company && (typeof company !== 'string' || company.length > 100)) {
      return res.status(400).json({ error: 'Nombre de empresa inválido.' });
    }

    if (message && (typeof message !== 'string' || message.length > 1000)) {
      return res.status(400).json({ error: 'El mensaje supera la longitud máxima permitida de 1000 caracteres.' });
    }

    if (!Array.isArray(selectedSupportIds) || selectedSupportIds.some(id => typeof id !== 'string')) {
      return res.status(400).json({ error: 'El listado de soportes seleccionados debe ser un arreglo de identificadores válidos.' });
    }

    // 3. Security Sanitize Message (escaping of tags to avoid HTML injection/XSS)
    const sanitizedMsg = message ? message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';

    const newLead = DBService.addLead({ 
      name: name.trim(), 
      company: company ? company.trim() : '', 
      email: email.trim().toLowerCase(), 
      phone: phone.trim(), 
      message: sanitizedMsg, 
      selectedSupportIds, 
      plazaContext: typeof plazaContext === 'string' ? plazaContext : 'Mendoza',
      campaignStartDate: typeof campaignStartDate === 'string' ? campaignStartDate : undefined,
      campaignEndDate: typeof campaignEndDate === 'string' ? campaignEndDate : undefined
    });
    
    res.status(201).json({ success: true, lead: newLead, message: 'Solicitud de cotización registrada con éxito.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al registrar la solicitud de cotización comercial.',
      details: message
    });
  }
});

app.get('/api/leads', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const leads = DBService.getLeads();
    res.json(leads);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al consultar las solicitudes de cotizaciones recibidas.',
      details: message
    });
  }
});

app.put('/api/leads/:id', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses: LeadStatus[] = ['pending', 'contacted', 'archived'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado de lead no válido.' });
    }
    const updated = DBService.updateLeadStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al actualizar el estado del lead.',
      details: message
    });
  }
});

// --- MEDIA KITS ENDPOINTS ---
app.get('/api/mediakits', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const mediakits = DBService.getMediaKits();
    res.json(mediakits);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al consultar los Media Kits comerciales.',
      details: message
    });
  }
});

app.post('/api/mediakits', authenticateToken(['SúperAdmin', 'Admin']), (req, res) => {
  try {
    const { title, clientName, plaza, comments, supportIds, slidesLayout } = req.body;
    if (!title || !clientName || !plaza || !supportIds || supportIds.length === 0) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes para generar el Media Kit.' });
    }
    
    if (typeof title !== 'string' || title.trim().length === 0 || title.length > 100) {
      return res.status(400).json({ error: 'Título de propuesta inválido.' });
    }
    if (typeof clientName !== 'string' || clientName.trim().length === 0 || clientName.length > 100) {
      return res.status(400).json({ error: 'Nombre del cliente inválido.' });
    }
    const validPlazas: SupportPlaza[] = ['Mendoza', 'Buenos Aires'];
    if (!validPlazas.includes(plaza)) {
      return res.status(400).json({ error: 'Plaza del plan de medios inválida.' });
    }
    if (!Array.isArray(supportIds) || supportIds.some(id => typeof id !== 'string')) {
      return res.status(400).json({ error: 'El listado de soportes debe ser un arreglo de identificadores válidos.' });
    }

    const newMediaKit = DBService.addMediaKit({ 
      title: title.trim(), 
      clientName: clientName.trim(), 
      plaza, 
      comments: comments ? comments.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '', 
      supportIds, 
      slidesLayout: typeof slidesLayout === 'string' ? slidesLayout : 'Modern Pitch' 
    });
    res.status(201).json(newMediaKit);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al guardar el Media Kit comercial.',
      details: message
    });
  }
});

app.delete('/api/mediakits/:id', authenticateToken(['SúperAdmin']), (req, res) => {
  try {
    const success = DBService.deleteMediaKit(req.params.id);
    if (success) {
      res.json({ success: true, message: 'Media Kit comercial eliminado correctamente.' });
    } else {
      res.status(404).json({ error: 'Media Kit no encontrado.' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido.';
    res.status(500).json({ 
      error: 'Error al eliminar el Media Kit de la base de datos.',
      details: message
    });
  }
});

// --- INTEGRATION WITH VITE DEV SERVER / PRODUCTION STATIC SERVER ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: distPath });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
