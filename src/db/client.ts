import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const { Pool } = pg;

// Add global connection pool caching to persist across hot-reloads
declare global {
  var _postgresPool: pg.Pool | undefined;
}

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export let pool: pg.Pool | undefined;
export let db: any;

if (dbUrl) {
  // Determine if SSL is required (always true for remote PostgreSQL providers like Neon)
  const useSsl = !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1");

  // Create or reuse global connection pool with high reliability settings
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      connectionString: dbUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
      max: 15, // Perfect pool size for concurrent serverless / container execution
      connectionTimeoutMillis: 20000, // Graceful timeout for slow network paths
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    });

    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle PostgreSQL pool client:", err);
    });
  }

  pool = global._postgresPool;
  db = drizzle(pool, { schema });
  console.log("[Database] Neon PostgreSQL client initialized successfully via Drizzle ORM.");
} else {
  console.warn("\n\x1b[33m[Database Warning] DATABASE_URL or POSTGRES_URL environment variable is missing.\x1b[0m");
  console.warn("\x1b[33mThe application will start in standby mode without database access. Configure DATABASE_URL in Settings to connect to your database.\n\x1b[0m");
  
  pool = undefined;
  
  // High-performance nested proxy to intercept any DB query gracefully without crashing on startup
  const createDbProxy = (): any => {
    const target = () => {};
    const handler: ProxyHandler<any> = {
      get(t, prop) {
        if (prop === "then") return undefined; // Avoid blocking Promise-resolving chains
        return new Proxy(target, handler);
      },
      apply(t, thisArg, args) {
        throw new Error("DATABASE_URL / POSTGRES_URL environment variable is missing. Please add a database connection string in Settings to access database features.");
      }
    };
    return new Proxy(target, handler);
  };
  
  db = createDbProxy();
}
