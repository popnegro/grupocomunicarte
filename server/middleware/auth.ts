import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

/**
 * Verifies the Firebase ID token and attaches the decoded identity to the request.
 * Protected administrative routes require a tenant claim; public endpoints do
 * not use this middleware.
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
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (!decodedToken.tenant_id || typeof decodedToken.tenant_id !== "string") {
      return res.status(403).json({
        success: false,
        error: {
          code: "TENANT_REQUIRED",
          message: "Acceso denegado: Tenant no identificado para el usuario.",
        },
      });
    }

    req.user = decodedToken;
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
 * Requires a tenant claim after authentication. Kept as a composable middleware
 * for routes that want to make the authorization boundary explicit.
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
