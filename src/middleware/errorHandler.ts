import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.ts";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string>;

  constructor(errors: Record<string, string>, message: string = "Validation failed") {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden access: Insufficient permissions") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";

  logger.error(`Error in request: ${req.method} ${req.originalUrl}`, err);

  const response: any = {
    success: false,
    error: {
      message: err.message || "An unexpected error occurred",
      code: err.constructor.name || "Error"
    }
  };

  if (err instanceof ValidationError) {
    response.error.validationErrors = err.errors;
  }

  if (!isProd && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
