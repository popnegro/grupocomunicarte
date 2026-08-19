import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Método no permitido.' },
    });
  }

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const tenantId = process.env.DEFAULT_TENANT_ID;

  if (!databaseUrl || !tenantId) {
    console.error('[API GET /api/public/screens] Missing database configuration');
    return res.status(500).json({
      success: false,
      error: { code: 'CONFIG_ERROR', message: 'Error de configuración del servidor.' },
    });
  }

  try {
    const sql = neon(databaseUrl);
    const data = await sql`
      SELECT
        id,
        tenant_id AS "tenantId",
        nombre,
        zona,
        tipo,
        categoria,
        ciudad,
        impactos,
        precio,
        status,
        dimensiones,
        brillo,
        refresh_rate AS "refreshRate",
        formato,
        cobertura,
        ruta,
        lat,
        lng,
        nota,
        video,
        horarios,
        sync_id AS "syncId",
        hash,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM screens
      WHERE tenant_id = ${tenantId}
        AND status = 'Activo'
      ORDER BY nombre ASC
    `;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[API GET /api/public/screens]', error);
    return res.status(500).json({
      success: false,
      error: { code: 'DB_ERROR', message: 'Error al obtener las pantallas públicas.' },
    });
  }
}
