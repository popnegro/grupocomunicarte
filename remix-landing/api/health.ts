import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DBService } from '../server/db.service.js';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const supports = await DBService.getSupports();
    return res.status(200).json({
      status: 'ok',
      application: 'ok',
      database: 'ok',
      supports: supports.length,
      persistence: 'neon'
    });
  } catch (error) {
    console.error('[API /api/health]', error);
    return res.status(503).json({
      status: 'error',
      application: 'ok',
      database: 'error',
      persistence: 'neon'
    });
  }
}
