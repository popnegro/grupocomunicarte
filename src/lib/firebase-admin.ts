import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;

function initializeAdminApp(): App | null {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    const missingVars = [
      !privateKey && 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
      !clientEmail && 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      !projectId && 'FIREBASE_PROJECT_ID',
    ].filter(Boolean).join(', ');
    console.error(`Firebase Admin SDK: missing environment variables: ${missingVars}`);
    return null;
  }

  try {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    return app;
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  const currentApp = initializeAdminApp();
  return currentApp ? getAuth(currentApp) : null;
}

export function getAdminDb(): Firestore | null {
  const currentApp = initializeAdminApp();
  return currentApp ? getFirestore(currentApp) : null;
}
