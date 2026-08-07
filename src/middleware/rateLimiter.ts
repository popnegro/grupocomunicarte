import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler.ts";

interface RateLimitStore {
  [ip: string]: {
    timestamps: number[];
  };
}

const store: RateLimitStore = {};

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

export const createRateLimiter = (options: Partial<RateLimitOptions> = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const max = options.max || 100; // 100 requests default per windowMs
  const message = options.message || "Too many requests from this IP, please try again later.";

  // Periodic cleanup of the memory store to prevent leaks
  setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      store[ip].timestamps = store[ip].timestamps.filter(t => now - t < windowMs);
      if (store[ip].timestamps.length === 0) {
        delete store[ip];
      }
    }
  }, windowMs * 2);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();

    if (!store[ip]) {
      store[ip] = { timestamps: [] };
    }

    // Filter out timestamps outside of the window
    store[ip].timestamps = store[ip].timestamps.filter(t => now - t < windowMs);

    if (store[ip].timestamps.length >= max) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      return next(new AppError(message, 429));
    }

    store[ip].timestamps.push(now);
    
    // Set standard RateLimit headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - store[ip].timestamps.length);
    res.setHeader("X-RateLimit-Reset", new Date(now + windowMs).toISOString());

    next();
  };
};

export const defaultRateLimiter = createRateLimiter();
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 minutes for authentication
  message: "Too many authentication attempts, please try again after 15 minutes."
});
