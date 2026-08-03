import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";
import { SEED_SCREENS, INITIAL_CLIENTES, INITIAL_MEDIAKITS, INITIAL_LOGS } from "./seedData.ts";

const { Pool } = pg;

// Add global connection pool and store caching to persist across hot-reloads
declare global {
  var _postgresPool: pg.Pool | undefined;
  var _inMemoryStore: {
    users: any[];
    leads: any[];
    screens: any[];
    clientes: any[];
    mediakits: any[];
    changelogs: any[];
    googleCredentials: any[];
  } | undefined;
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
  console.warn("\x1b[33mThe application will start in high-fidelity standby mode with fully reactive in-memory state. Configure DATABASE_URL in Settings to connect to a real PostgreSQL database.\n\x1b[0m");
  
  pool = undefined;

  // Initialize high-fidelity reactive in-memory store
  if (!global._inMemoryStore) {
    global._inMemoryStore = {
      users: [],
      leads: [
        { id: 1, name: "Sofía Rodríguez", email: "sofia@acme.com", company: "Acme Corp", source: "Landing Form", status: "new", date: "2026-07-25T14:32:00Z", value: 1200 },
        { id: 2, name: "Mateo Silva", email: "mateo@silva.io", company: "Silva Consulting", source: "Onboarding Quiz", status: "qualified", date: "2026-07-24T09:15:00Z", value: 3500 },
        { id: 3, name: "Lucía Fernández", email: "lfernandez@techflow.net", company: "TechFlow Ltd", source: "Landing Form", status: "contacted", date: "2026-07-23T18:45:00Z", value: 800 },
        { id: 4, name: "Diego Torres", email: "diego@growthlabs.co", company: "Diego Torres S.A.", source: "Onboarding Quiz", status: "closed", date: "2026-07-21T11:20:00Z", value: 5000 },
      ],
      screens: SEED_SCREENS.map((s, idx) => ({ ...s, id: s.id || `sc-${idx + 1}` })),
      clientes: INITIAL_CLIENTES.map((c, idx) => ({ ...c, id: c.id || String(idx + 1) })),
      mediakits: INITIAL_MEDIAKITS.map((m, idx) => ({ ...m, id: m.id || String(idx + 1) })),
      changelogs: INITIAL_LOGS.map((l, idx) => ({ ...l, id: l.id || String(idx + 1) })),
      googleCredentials: [],
    };
  }

  const getTableName = (table: any): string => {
    if (table === schema.users) return "users";
    if (table === schema.leads) return "leads";
    if (table === schema.screens) return "screens";
    if (table === schema.clientes) return "clientes";
    if (table === schema.mediakits) return "mediakits";
    if (table === schema.changelogs) return "changelogs";
    if (table === schema.googleCredentials) return "googleCredentials";
    return "unknown";
  };

  const extractValueFromCondition = (cond: any): any => {
    if (!cond) return undefined;
    if (typeof cond !== "object") return cond;

    if ("value" in cond) {
      return cond.value;
    }
    if ("right" in cond) {
      const r = cond.right;
      if (r && typeof r === "object") {
        if ("value" in r) return r.value;
      }
      return r;
    }

    for (const key of Object.keys(cond)) {
      const val = cond[key];
      if (key === "value" || key === "right") {
        if (val && typeof val === "object" && "value" in val) {
          return val.value;
        }
        return val;
      }
    }
    return undefined;
  };

  const getInMemoryData = (table: any, options: { condition?: any; limit?: number }) => {
    const tableName = getTableName(table);
    let list = global._inMemoryStore ? global._inMemoryStore[tableName as keyof typeof global._inMemoryStore] || [] : [];
    
    if (options.condition) {
      const extractedVal = extractValueFromCondition(options.condition);
      if (extractedVal !== undefined) {
        if (tableName === "users") {
          list = list.filter((u: any) => u.uid === extractedVal || u.id === extractedVal);
        } else if (tableName === "mediakits") {
          list = list.filter((m: any) => m.id === extractedVal || m.id === String(extractedVal));
        } else if (tableName === "screens") {
          list = list.filter((s: any) => s.id === extractedVal || s.id === String(extractedVal));
        } else if (tableName === "clientes") {
          list = list.filter((c: any) => c.id === extractedVal || c.id === String(extractedVal));
        } else if (tableName === "googleCredentials") {
          list = list.filter((g: any) => g.userId === extractedVal || g.id === extractedVal);
        }
      }
    }

    let result = list.map((item: any) => ({ ...item }));

    if (tableName === "leads") {
      result.sort((a: any, b: any) => Number(b.id) - Number(a.id));
    }

    if (options.limit !== undefined) {
      result = result.slice(0, options.limit);
    }

    return result;
  };

  const insertInMemoryData = (table: any, data: any, onConflictUpdate = false) => {
    const tableName = getTableName(table);
    if (!global._inMemoryStore) return [];

    const list = global._inMemoryStore[tableName as keyof typeof global._inMemoryStore] || [];
    const rawItems = Array.isArray(data) ? data : [data];
    const insertedItems: any[] = [];

    for (const item of rawItems) {
      const newItem = { ...item };
      
      if (newItem.id === undefined) {
        if (tableName === "users") {
          newItem.id = list.length + 1;
        } else if (tableName === "leads") {
          newItem.id = list.length > 0 ? Math.max(...list.map((l: any) => Number(l.id) || 0)) + 1 : 1;
        } else {
          newItem.id = `${tableName.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
      }

      if (tableName === "users" && onConflictUpdate) {
        const existingIdx = list.findIndex((u: any) => u.uid === newItem.uid);
        if (existingIdx !== -1) {
          list[existingIdx] = { ...list[existingIdx], ...newItem };
          insertedItems.push(list[existingIdx]);
          continue;
        }
      }

      list.push(newItem);
      insertedItems.push(newItem);
    }

    return insertedItems;
  };

  const updateInMemoryData = (table: any, data: any, condition: any) => {
    const tableName = getTableName(table);
    if (!global._inMemoryStore) return [];

    const list = global._inMemoryStore[tableName as keyof typeof global._inMemoryStore] || [];
    const extractedVal = extractValueFromCondition(condition);
    const updatedItems: any[] = [];

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      let match = false;
      
      if (tableName === "screens" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;
      else if (tableName === "clientes" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;
      else if (tableName === "mediakits" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;
      else if (tableName === "googleCredentials" && (item.userId === extractedVal || item.id === extractedVal)) match = true;

      if (match) {
        list[i] = { ...item, ...data };
        updatedItems.push(list[i]);
      }
    }

    return updatedItems;
  };

  const deleteInMemoryData = (table: any, condition: any) => {
    const tableName = getTableName(table);
    if (!global._inMemoryStore) return [];

    const list = global._inMemoryStore[tableName as keyof typeof global._inMemoryStore] || [];
    const extractedVal = extractValueFromCondition(condition);
    const deletedItems: any[] = [];
    const remaining: any[] = [];

    for (const item of list) {
      let match = false;
      if (tableName === "screens" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;
      else if (tableName === "clientes" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;
      else if (tableName === "mediakits" && (item.id === extractedVal || item.id === String(extractedVal))) match = true;

      if (match) {
        deletedItems.push(item);
      } else {
        remaining.push(item);
      }
    }

    global._inMemoryStore[tableName as keyof typeof global._inMemoryStore] = remaining;
    return deletedItems;
  };

  // High-fidelity mock Drizzle Client
  db = {
    select: () => ({
      from: (table: any) => ({
        where: (condition: any) => ({
          orderBy: (...args: any[]) => ({
            limit: (n: number) => ({
              then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { condition, limit: n }))),
            }),
            then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { condition }))),
          }),
          limit: (n: number) => ({
            then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { condition, limit: n }))),
          }),
          then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { condition }))),
        }),
        orderBy: (...args: any[]) => ({
          limit: (n: number) => ({
            then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { limit: n }))),
          }),
          then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, {}))),
        }),
        limit: (n: number) => ({
          then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, { limit: n }))),
        }),
        then: (resolve: any) => Promise.resolve(resolve(getInMemoryData(table, {}))),
      }),
    }),
    insert: (table: any) => ({
      values: (data: any) => ({
        onConflictDoUpdate: (options: any) => ({
          returning: () => Promise.resolve(insertInMemoryData(table, data, true)),
          then: (resolve: any) => Promise.resolve(insertInMemoryData(table, data, true)).then(resolve),
        }),
        returning: () => Promise.resolve(insertInMemoryData(table, data, false)),
        then: (resolve: any) => Promise.resolve(insertInMemoryData(table, data, false)).then(resolve),
      }),
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => Promise.resolve(updateInMemoryData(table, data, condition)),
          then: (resolve: any) => Promise.resolve(updateInMemoryData(table, data, condition)).then(resolve),
        }),
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => ({
        returning: () => Promise.resolve(deleteInMemoryData(table, condition)),
        then: (resolve: any) => Promise.resolve(deleteInMemoryData(table, condition)).then(resolve),
      }),
    }),
  };
}
