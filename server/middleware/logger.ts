import { Request, Response, NextFunction } from "express";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

export const logger = {
  info(message: string, meta?: any) {
    console.log(`[${new Date().toISOString()}] [${LogLevel.INFO}] ${message}`, meta ? JSON.stringify(meta) : "");
  },
  warn(message: string, meta?: any) {
    console.warn(`[${new Date().toISOString()}] [${LogLevel.WARN}] ${message}`, meta ? JSON.stringify(meta) : "");
  },
  error(message: string, error?: any) {
    console.error(`[${new Date().toISOString()}] [${LogLevel.ERROR}] ${message}`, error ? (error.stack || error.message || error) : "");
  }
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMsg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    if (res.statusCode >= 500) {
      logger.error(logMsg);
    } else if (res.statusCode >= 400) {
      logger.warn(logMsg);
    } else {
      logger.info(logMsg);
    }
  });
  next();
};
