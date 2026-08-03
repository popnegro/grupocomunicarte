import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const sqlHost = process.env.SQL_HOST;
const sqlDbName = process.env.SQL_DB_NAME;
const user = process.env.SQL_ADMIN_USER || process.env.SQL_USER;
const password = process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD;

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const config: any = {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  verbose: true,
};

if (sqlHost && sqlDbName && user) {
  config.dbCredentials = {
    host: sqlHost,
    user: user,
    password: password || "",
    database: sqlDbName,
    ssl: false,
  };
} else if (dbUrl) {
  config.dbCredentials = {
    url: dbUrl,
    ssl: !dbUrl.includes("localhost") && !dbUrl.includes("127.0.0.1") ? { rejectUnauthorized: false } : false,
  };
} else {
  // Throw an error if no database configuration is found for Drizzle Kit
  throw new Error("Drizzle config error: No database configuration found. Please set SQL_* or DATABASE_URL/POSTGRES_URL environment variables.");
}

export default defineConfig(config);
