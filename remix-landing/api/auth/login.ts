import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signToken } from '../../server/jwt.service.js';
import { verifyPassword } from '../../server/crypto.service.js';

const SUPERADMIN_EMAIL = process.env.INITIAL_SUPERADMIN_EMAIL?.trim().toLowerCase();
const SUPERADMIN_PASSWORD = process.env.INITIAL_SUPERADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').json(body);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método no permitido.' });
    return;
  }

  if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    sendJson(res, 503, { error: 'Autenticación no configurada en producción.' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!email || !password) {
    sendJson(res, 400, { error: 'Formato de credenciales de acceso inválido.' });
    return;
  }

  let user: { uid: string; email: string; name: string; role: 'SúperAdmin' | 'Admin' } | null = null;
  let passwordMatches = false;

  if (email === SUPERADMIN_EMAIL) {
    passwordMatches = verifyPassword(password, SUPERADMIN_PASSWORD);
    if (passwordMatches) {
      user = {
        uid: 'sa1',
        email: SUPERADMIN_EMAIL,
        name: 'Director General',
        role: 'SúperAdmin',
      };
    }
  } else if (email === ADMIN_EMAIL) {
    passwordMatches = verifyPassword(password, ADMIN_PASSWORD);
    if (passwordMatches) {
      user = {
        uid: 'a1',
        email: ADMIN_EMAIL,
        name: 'Operador Comercial',
        role: 'Admin',
      };
    }
  }

  if (!passwordMatches || !user) {
    sendJson(res, 401, { error: 'Credenciales inválidas.' });
    return;
  }

  const token = signToken(user);
  sendJson(res, 200, { token, user });
}
