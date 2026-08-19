import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    success: true,
    status: 'ok',
    runtime: 'vercel-serverless',
    node: process.version,
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    tenantConfigured: Boolean(process.env.DEFAULT_TENANT_ID),
    firebaseConfigured: Boolean(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    ),
  });
}
