import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../server/db.service.js';
import { requireSession, withSecurityHeaders } from '../server/api-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withSecurityHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!requireSession(req, res)) return;
  try {
    if (req.method === 'GET') return res.status(200).json(await DBService.getMediaKits());
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const { title, clientName, plaza, supportIds } = body;
      if (!title || !clientName || !plaza || !Array.isArray(supportIds)) return res.status(400).json({ error: 'Título, cliente, plaza y soportes son obligatorios.' });
      return res.status(201).json(await DBService.addMediaKit({ title: String(title).trim(), clientName: String(clientName).trim(), plaza, comments: typeof body.comments === 'string' ? body.comments.trim() : undefined, supportIds, slidesLayout: body.slidesLayout, audience: body.audience, campaignStartDate: body.campaignStartDate, campaignEndDate: body.campaignEndDate }));
    }
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('[API /api/mediakits]', error);
    return res.status(500).json({ error: 'Error al procesar los media kits.' });
  }
}
