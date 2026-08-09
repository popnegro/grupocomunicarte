import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Compatibility wrapper kept for dashboard imports. The canonical Firebase Admin
// initialization lives in src/lib/firebase-admin.ts.
let app: App | undefined;

if (getApps().length > 0) {
  app = getApps()[0];
} else {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (privateKey && clientEmail && projectId) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  }
}

export const adminAuth = app ? getAuth(app) : null;
