import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const { Pool } = pg;

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: pg.Pool | undefined;
}

// Function to create or retrieve the connection pool.
export const createPool = () => {
  if (!global._postgresPool) {
    // Rely on SQL_* env vars. Fallback to DATABASE_URL/POSTGRES_URL if needed for local development setup.
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_USER;
    const password = process.env.SQL_PASSWORD;
    const database = process.env.SQL_DB_NAME;

    if (host && user) {
      global._postgresPool = new Pool({
        host,
        user,
        password,
        database,
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    } else {
      const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
      if (dbUrl) {
        const useSsl = !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1");
        global._postgresPool = new Pool({
          connectionString: dbUrl,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          max: 10,
          connectionTimeoutMillis: 15000,
        });
      } else {
        throw new Error("No database configuration found (neither SQL_* environment variables nor DATABASE_URL/POSTGRES_URL are set)");
      }
    }

    // Prevent unhandled pool-level errors from crashing the application
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};

// Create or retrieve the pool instance.
const pool = createPool();

// Initialize Drizzle with the pool and schema.
export const db = drizzle(pool, { schema });
