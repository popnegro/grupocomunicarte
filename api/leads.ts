import { db } from '../src/db/index';
import { leads } from '../src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, type AuthRequest } from '../server/middleware/auth';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return protect(req as AuthRequest, res, async () => {
      const authReq = req as AuthRequest;
      const tenantId = authReq.user?.tenant_id;

      if (!tenantId) {
        return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Acceso denegado: Tenant no identificado.' } });
      }

      try {
        const rows = await db
          .select()
          .from(leads)
          .where(eq(leads.tenantId, tenantId))
          .orderBy(desc(leads.createdAt))
          .limit(100);

        return res.status(200).json({ success: true, data: rows });
      } catch (error) {
        console.error('[API GET /api/leads]', error);
        return res.status(500).json({ success: false, error: { code: 'DB_ERROR', message: 'Error al obtener los leads.' } });
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
      const {
        name,
        email,
        phone,
        company,
        message,
        source = 'Formulario Web',
        status = 'new',
        value = 0,
      } = body;
      const defaultTenantId = process.env.DEFAULT_TENANT_ID;

      if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El nombre es obligatorio.' } });
      }
      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'El correo electrónico no es válido.' } });
      }
      if (company !== undefined && typeof company !== 'string') {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'La empresa no es válida.' } });
      }

      const normalizedStatus = ['new', 'contacted', 'qualified', 'closed'].includes(status) ? status : 'new';
      const numericValue = Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;
      const normalizedMessage = typeof message === 'string' && message.trim() ? message.trim() : 'Consulta comercial desde el sitio web.';

      const newLead = {
        id: uuidv4(),
        tenantId: defaultTenantId || null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: typeof phone === 'string' && phone.trim() ? phone.trim() : null,
        company: typeof company === 'string' && company.trim() ? company.trim() : null,
        message: normalizedMessage,
        source: typeof source === 'string' && source.trim() ? source.trim() : 'Formulario Web',
        status: normalizedStatus,
        value: numericValue,
      };

      const insertedLeads = await db.insert(leads).values(newLead).returning();
      if (insertedLeads.length === 0) {
        return res.status(500).json({ success: false, error: { code: 'DB_INSERT_FAILED', message: 'No se pudo registrar el lead.' } });
      }

      let notificationSent = false;
      const resendApiKey = process.env.RESEND_API_KEY;
      const salesNotifyEmail = process.env.SALES_NOTIFY_EMAIL;
      if (resendApiKey && salesNotifyEmail) {
        try {
          const subject = `Nuevo lead: ${newLead.name} — ${newLead.source}`;
          const html = `<h2>Nuevo lead comercial</h2><p><strong>Nombre:</strong> ${escapeHtml(newLead.name)}</p><p><strong>Email:</strong> ${escapeHtml(newLead.email)}</p><p><strong>Empresa:</strong> ${escapeHtml(newLead.company || '—')}</p><p><strong>Fuente:</strong> ${escapeHtml(newLead.source)}</p><p><strong>Estado:</strong> ${escapeHtml(newLead.status)}</p><p><strong>Valor estimado:</strong> $${newLead.value.toLocaleString('es-AR')}</p><hr /><p><strong>Detalle:</strong></p><p>${escapeHtml(newLead.message).replace(/\n/g, '<br />')}</p>`;
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', to: [salesNotifyEmail], subject, html }),
          });
          notificationSent = resendResponse.ok;
        } catch (error) {
          console.warn('[API POST /api/leads] Resend notification error:', error);
        }
      }

      return res.status(201).json({ success: true, data: insertedLeads[0], meta: { notificationSent } });
    } catch (error: any) {
      console.error('[API POST /api/leads]', error);
      if (error?.code === '23505') {
        return res.status(409).json({ success: false, error: { code: 'CONFLICT', message: 'Este correo electrónico ya ha sido registrado.' } });
      }
      return res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Error interno al crear el lead.' } });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Método no permitido.' } });
}
