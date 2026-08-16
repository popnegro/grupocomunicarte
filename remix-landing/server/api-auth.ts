import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './jwt.service.js';
import type { UserRole, UserSession } from '../src/types/index.js';

export function requireSession(req: VercelRequest, res: VercelResponse, allowedRoles: UserRole[] = ['SúperAdmin', 'Admin']): UserSession | null {
  const header = req.headers.authorization;
  const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) { res.status(401).json({ error: 'Acceso no autorizado: Token de sesión faltante.' }); return null; }
  try {
    const payload = verifyToken(token);
    const session = payload as unknown as UserSession;
    if (!session?.uid || !session.role || !allowedRoles.includes(session.role)) { res.status(403).json({ error: 'Permisos insuficientes para realizar esta operación.' }); return null; }
    return session;
  } catch { res.status(401).json({ error: 'Sesión inválida o expirada.' }); return null; }
}

export function withSecurityHeaders(res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
}
