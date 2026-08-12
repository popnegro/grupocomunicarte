import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.ts";

interface CacheEntry {
  body: any;
  headers: Record<string, any>;
  statusCode: number;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry>();

// Simple in-memory cache helper
export const memoryCache = {
  get(key: string): CacheEntry | null {
    const entry = cacheStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      cacheStore.delete(key);
      return null;
    }
    return entry;
  },

  set(key: string, value: CacheEntry) {
    cacheStore.set(key, value);
  },

  delete(key: string) {
    cacheStore.delete(key);
  },

  clear() {
    cacheStore.clear();
  },

  invalidatePattern(pattern: RegExp) {
    for (const key of cacheStore.keys()) {
      if (pattern.test(key)) {
        cacheStore.delete(key);
        logger.info(`[Cache] Invalided cache key due to matching pattern: ${key}`);
      }
    }
  }
};

export const cacheMiddleware = (ttlMs: number = 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      // If doing write operation, invalidate caches related to this route
      const basePath = req.originalUrl.split("?")[0];
      // Invalidate cache for exact path, or general plural paths
      const rootPath = basePath.split("/")[2] || ""; // e.g., "screens" or "campaigns"
      if (rootPath) {
        memoryCache.invalidatePattern(new RegExp(`^/api/v1/${rootPath}`));
      }
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = memoryCache.get(key);

    if (cachedResponse) {
      logger.info(`[Cache] Cache hit for: ${key}`);
      // Re-apply headers
      Object.entries(cachedResponse.headers).forEach(([k, v]) => {
        if (v !== undefined) res.setHeader(k, v);
      });
      res.setHeader("X-Cache", "HIT");
      return res.status(cachedResponse.statusCode).json(cachedResponse.body);
    }

    logger.info(`[Cache] Cache miss for: ${key}`);
    res.setHeader("X-Cache", "MISS");

    // Intercept res.json to capture response
    const originalJson = res.json;
    res.json = function (body: any) {
      // Store in cache only for successful 2xx responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, {
          body,
          headers: { ...res.getHeaders() },
          statusCode: res.statusCode,
          expiresAt: Date.now() + ttlMs
        });
      }
      return originalJson.call(this, body);
    };

    next();
  };
};
