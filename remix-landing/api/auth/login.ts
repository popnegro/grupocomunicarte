import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signToken } from '../../server/jwt.service.js';
import { hashPassword, verifyPassword } from '../../server/crypto.service.js';

const SUPERADMIN_EMAIL = process.env.INITIAL_SUPERADMIN_EMAIL?.trim().toLowerCase();
const SUPERADMIN_PASSWORD = process.env.INITIAL_SUPERADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

const SUPERADMIN_HASH = SUPERADMIN_PASSWORD ? hashPassword(SUPERADMIN_PASSWORD) : undefined;
const ADMIN_HASH = ADMIN_PASSWORD ? hashPassword(ADMIN_PASSWORD) : undefined;

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

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Método no permitido.' });

  if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || !ADMIN_EMAIL || !ADMIN_PASSWORD || !SUPERADMIN_HASH || !ADMIN_HASH) {
    return sendJson(res, 503, { error: 'Autenticación no configurada en producción.' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!email || !password) return sendJson(res, 400, { error: 'Formato de credenciales de acceso inválido.' });

  let user: { uid: string; email: string; name: string; role: 'SúperAdmin' | 'Admin' } | null = null;
  let passwordMatches = false;

  if (email === SUPERADMIN_EMAIL) {
    passwordMatches = verifyPassword(password, SUPERADMIN_HASH);
    if (passwordMatches) user = { uid: 'sa1', email: SUPERADMIN_EMAIL, name: 'Director General', role: 'SúperAdmin' };
  } else if (email === ADMIN_EMAIL) {
    passwordMatches = verifyPassword(password, ADMIN_HASH);
    if (passwordMatches) user = { uid: 'a1', email: ADMIN_EMAIL, name: 'Operador Comercial', role: 'Admin' };
  }

  if (!passwordMatches || !user) return sendJson(res, 401, { error: 'Credenciales inválidas.' });
  return sendJson(res, 200, { token: signToken(user), user });
}
