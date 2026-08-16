import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../server/db.service.js';
import { requireSession, withSecurityHeaders } from '../server/api-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withSecurityHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') return res.status(200).json(await DBService.getSupports());
    if (!requireSession(req, res)) return;
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const required = ['name','plaza','type','address','latitude','longitude','description','size','imageUrl'];
      if (required.some((key) => body[key] === undefined || body[key] === null || body[key] === '')) return res.status(400).json({ error: 'Todos los campos obligatorios del soporte deben ser provistos.' });
      return res.status(201).json(await DBService.addSupport({ ...body, name: String(body.name).trim(), address: String(body.address).trim(), description: String(body.description).trim(), size: String(body.size).trim(), imageUrl: String(body.imageUrl).trim(), status: body.status === 'reserved' ? 'reserved' : 'available' }));
    }
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('[API /api/inventory]', error);
    return res.status(500).json({ error: 'Error al procesar el inventario.' });
  }
}
