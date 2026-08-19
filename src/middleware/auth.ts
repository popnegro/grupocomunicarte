import { Request, Response, NextFunction } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { getAdminAuth } from "../lib/firebase-admin";

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const adminAuth = getAdminAuth();

  if (!adminAuth) {
    return res.status(503).json({
      success: false,
      error: { code: "FIREBASE_NOT_INITIALIZED", message: "El servicio de autenticación no está disponible en este momento." },
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Acceso denegado: Token de autenticación no proporcionado." },
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({
      success: false,
      error: { code: "INVALID_TOKEN", message: "Acceso denegado: Token de autenticación inválido o expirado." },
    });
  }
};

export const requireAuth = protect;
