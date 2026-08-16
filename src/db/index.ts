// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

/**
 * Production database boundary.
 *
 * The application must never silently fall back to in-memory/mock data. A
 * missing DATABASE_URL is a deployment/configuration error and must fail fast.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    '[Database] DATABASE_URL is required. Mock/in-memory persistence is disabled.'
  );
}

const sql = neon(databaseUrl);

/**
 * PostgreSQL/Neon is the single source of truth for application persistence.
 */
export const db = drizzle(sql, { schema });
