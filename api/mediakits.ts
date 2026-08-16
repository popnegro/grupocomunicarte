import { db } from '../src/db/index';
import { mediakits } from '../src/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { protect, type AuthRequest } from '../server/middleware/auth';

export default async function handler(req: any, res: any) {
  await protect(req as AuthRequest, res, async () => {
    const authReq = req as AuthRequest;
    const tenantId = authReq.user?.tenant_id;

    if (!tenantId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Acceso denegado: Tenant no identificado.' },
      });
    }

    try {
      if (req.method === 'GET') {
        const rows = await db
          .select()
          .from(mediakits)
          .where(eq(mediakits.tenantId, tenantId))
          .orderBy(desc(mediakits.createdAt));

        return res.status(200).json({ success: true, data: rows });
      }

      if (req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
        const { nombre } = body;

        if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
          return res.status(400).json({
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'El nombre del media kit es obligatorio.' },
          });
        }

        const newMediaKit = {
          id: uuidv4(),
          tenantId,
          ...body,
          nombre: nombre.trim(),
        };

        const inserted = await db.insert(mediakits).values(newMediaKit).returning();
        return res.status(201).json({ success: true, data: inserted[0] });
      }

      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({
        success: false,
        error: { code: 'METHOD_NOT_ALLOWED', message: 'Método no permitido.' },
      });
    } catch (error) {
      console.error('[API /api/mediakits]', error);
      return res.status(500).json({
        success: false,
        error: { code: 'DB_ERROR', message: 'Error al procesar los media kits.' },
      });
    }
  });
}
