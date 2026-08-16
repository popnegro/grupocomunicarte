import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../server/db.service.js';
import { requireSession, withSecurityHeaders } from '../server/api-auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  withSecurityHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      if (!requireSession(req, res)) return;
      return res.status(200).json(await DBService.getLeads());
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
      const { name, company, email, phone } = body;
      if (![name, company, email, phone].every((v) => typeof v === 'string' && v.trim())) return res.status(400).json({ error: 'Nombre, empresa, email y teléfono son obligatorios.' });
      return res.status(201).json(await DBService.addLead({ name: name.trim(), company: company.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), message: typeof body.message === 'string' ? body.message.trim() : undefined, selectedSupportIds: Array.isArray(body.selectedSupportIds) ? body.selectedSupportIds : [], plazaContext: typeof body.plazaContext === 'string' ? body.plazaContext : undefined, campaignStartDate: typeof body.campaignStartDate === 'string' ? body.campaignStartDate : undefined, campaignEndDate: typeof body.campaignEndDate === 'string' ? body.campaignEndDate : undefined }));
    }
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('[API /api/leads]', error);
    return res.status(500).json({ error: 'Error al procesar los leads.' });
  }
}
