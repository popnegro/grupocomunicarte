import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

/**
 * Verifies the Firebase ID token and attaches the decoded identity to the request.
 * This middleware is intentionally authentication-only; tenant authorization is
 * handled separately so public endpoints can remain public.
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!adminAuth) {
    return res.status(503).json({
      success: false,
      error: {
        code: "FIREBASE_NOT_INITIALIZED",
        message: "El servicio de autenticación no está disponible en este momento.",
      },
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Acceso denegado: Token de autenticación no proporcionado.",
      },
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Acceso denegado: Token de autenticación vacío.",
      },
    });
  }

  try {
    req.user = await adminAuth.verifyIdToken(token);
    return next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Acceso denegado: Token de autenticación inválido o expirado.",
      },
    });
  }
};

/**
 * Requires a tenant claim after authentication. Never falls back to a default
 * tenant for authenticated administrative requests, preventing cross-tenant
 * data access when a token is misconfigured.
 */
export const requireTenant = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Autenticación requerida.",
      },
    });
  }

  if (!req.user.tenant_id || typeof req.user.tenant_id !== "string") {
    return res.status(403).json({
      success: false,
      error: {
        code: "TENANT_REQUIRED",
        message: "Acceso denegado: Tenant no identificado para el usuario.",
      },
    });
  }

  return next();
};

export const requireAuth = protect;
