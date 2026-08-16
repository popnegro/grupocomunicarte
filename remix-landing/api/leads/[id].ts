import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../../server/db.service.js';
import { requireSession, withSecurityHeaders } from '../../server/api-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withSecurityHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireSession(req, res)) return;
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!id) return res.status(400).json({ error: 'ID de lead requerido.' });
  try {
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      if (!['pending', 'contacted', 'archived'].includes(body.status)) return res.status(400).json({ error: 'Estado de lead inválido.' });
      return res.status(200).json(await DBService.updateLeadStatus(id, body.status));
    }
    res.setHeader('Allow', 'PUT, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('not found')) return res.status(404).json({ error: 'Lead no encontrado.' });
    return res.status(500).json({ error: 'Error al modificar el lead.' });
  }
}
