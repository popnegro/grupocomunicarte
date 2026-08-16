import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../../server/db.service.js';
import { requireSession, withSecurityHeaders } from '../../server/api-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withSecurityHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireSession(req, res)) return;
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID de media kit requerido.' });
  try {
    if (req.method === 'DELETE') return (await DBService.deleteMediaKit(id)) ? res.status(204).end() : res.status(404).json({ error: 'Media kit no encontrado.' });
    res.setHeader('Allow','DELETE, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch {
    return res.status(500).json({ error: 'Error al eliminar el media kit.' });
  }
}
