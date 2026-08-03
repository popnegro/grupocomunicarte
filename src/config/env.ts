/**
 * Centralized Server-Side Environment Configuration Module
 * 
 * This module safely reads, validates, and transforms environment variables for the backend server.
 * It provides defaults where applicable and throws clear descriptive errors if required
 * configuration is missing when accessed.
 */

// Basic interface for our configuration structure
export interface Config {
  nodeEnv: string;
  port: number;
  appName: string;
  appUrl: string;
  
  // Database
  databaseUrl: string;
  
  // Google OAuth & Services
  google: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    slidesTemplateId: string;
    driveFolderId: string;
  };
  
  // Resend Email
  resend: {
    apiKey: string;
    salesNotifyEmail: string;
  };
  
  // Authentication & Sessions
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    sessionSecret: string;
  };
  
  // Storage & Limits
  storage: {
    uploadProvider: string;
    maxImageSizeMb: number;
    maxVideoSizeMb: number;
  };
  
  // Google Maps & Analytics
  maps: {
    apiKey: string;
  };
  analytics: {
    measurementId: string;
  };
  
  // Logging
  logLevel: string;
}

// Read and parse with default values
const isProd = process.env.NODE_ENV === "production";

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  appName: process.env.APP_NAME || "Grupo Comunicarte",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  
  databaseUrl: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
    slidesTemplateId: process.env.GOOGLE_SLIDES_TEMPLATE_ID || "",
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  },
  
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
    salesNotifyEmail: process.env.SALES_NOTIFY_EMAIL || "ventas@grupocomunicarte.com",
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || "default-super-secret-jwt-key-replace-me-in-prod",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    sessionSecret: process.env.SESSION_SECRET || "comunicarte-session-secret-change-me",
  },
  
  storage: {
    uploadProvider: process.env.UPLOAD_PROVIDER || "firebase",
    maxImageSizeMb: Number(process.env.MAX_IMAGE_SIZE_MB) || 10,
    maxVideoSizeMb: Number(process.env.MAX_VIDEO_SIZE_MB) || 250,
  },
  
  maps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  },
  
  analytics: {
    measurementId: process.env.GA_MEASUREMENT_ID || "",
  },
  
  logLevel: process.env.LOG_LEVEL || "info",
};

/**
 * Validate configuration for critical services.
 * In development, we print warnings instead of crashing.
 * In production, we throw clean errors for missing critical items.
 */
export function validateConfig() {
  const warnings: string[] = [];
  const errors: string[] = [];

  // 1. Database Check
  if (!config.databaseUrl) {
    if (isProd) {
      errors.push("DATABASE_URL or POSTGRES_URL is missing");
    } else {
      warnings.push("DATABASE_URL is missing. Relational DB features might fail.");
    }
  }

  // 2. Google OAuth Check
  if (!config.google.clientId || !config.google.clientSecret) {
    warnings.push("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing. Google OAuth will not function.");
  }

  // 3. Resend Key Check
  if (!config.resend.apiKey) {
    warnings.push("RESEND_API_KEY is missing. Email notifications will be disabled.");
  }

  // Log summary
  if (warnings.length > 0) {
    console.warn("\x1b[33m%s\x1b[0m", "[Config Warning] Some optional environment variables are not set:");
    warnings.forEach((w) => console.warn("\x1b[33m%s\x1b[0m", `  - ${w}`));
  }

  if (errors.length > 0) {
    console.error("\x1b[31m%s\x1b[0m", "[Config Error] Critical configuration missing for production:");
    errors.forEach((e) => console.error("\x1b[31m%s\x1b[0m", `  - ${e}`));
    throw new Error(`Critical configuration missing: ${errors.join(", ")}`);
  } else {
    console.log("\x1b[32m%s\x1b[0m", "[Config Check] Environment configuration checked successfully.");
  }
}
