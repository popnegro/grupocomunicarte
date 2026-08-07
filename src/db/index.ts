import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const { Pool } = pg;

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: pg.Pool | undefined;
  var _drizzleDb: any | undefined;
}

export const isDbConfigured = (): boolean => {
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER;
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return Boolean((host && user) || dbUrl);
};

// Function to create or retrieve the connection pool.
export const createPool = (): pg.Pool | null => {
  if (!isDbConfigured()) {
    console.warn("[Database] No SQL environment variables configured (SQL_HOST/USER or DATABASE_URL/POSTGRES_URL).");
    return null;
  }

  if (!global._postgresPool) {
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_USER;
    const password = process.env.SQL_PASSWORD;
    const database = process.env.SQL_DB_NAME;

    try {
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
        }
      }

      if (global._postgresPool) {
        global._postgresPool.on("error", (err) => {
          console.error("Unexpected error on idle SQL pool client:", err);
        });
      }
    } catch (err) {
      console.error("[Database] Error creating pool:", err);
      return null;
    }
  }
  return global._postgresPool;
};

export const getDb = () => {
  if (!global._drizzleDb) {
    const pool = createPool();
    if (pool) {
      global._drizzleDb = drizzle(pool, { schema });
    }
  }
  return global._drizzleDb;
};

// Safe chainable proxy for when DB is not configured or queries fail
const dummyChainable: any = new Proxy(
  () => dummyChainable,
  {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: any) => resolve([]);
      }
      return dummyChainable;
    },
    apply() {
      return dummyChainable;
    }
  }
);

// Safe db proxy object exported for full backward compatibility across all modules
export const db: any = new Proxy({}, {
  get(_target, prop) {
    const realDb = getDb();
    if (realDb && prop in realDb) {
      const val = (realDb as any)[prop];
      return typeof val === "function" ? val.bind(realDb) : val;
    }
    return dummyChainable;
  }
});

