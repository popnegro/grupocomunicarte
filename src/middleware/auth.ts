import { Request, Response, NextFunction } from "express";
import { adminAuth } from "../lib/firebase-admin"; // Corrected path
import type { DecodedIdToken } from "firebase-admin/auth";

// Extend the Request type to include a user property
export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!adminAuth) {
    return res.status(503).json({
      success: false,
      error: { code: "FIREBASE_NOT_INITIALIZED", message: "El servicio de autenticación no está disponible en este momento." }
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      error: { code: "UNAUTHORIZED", message: "Acceso denegado: Token de autenticación no proporcionado." } 
    });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded token to the request
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ 
      success: false, 
      error: { code: "INVALID_TOKEN", message: "Acceso denegado: Token de autenticación inválido o expirado." } 
    });
  }
};

export const requireAuth = protect;