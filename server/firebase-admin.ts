import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

// Singleton pattern to initialize Firebase Admin SDK only once.
function initializeAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  );
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    const missingVars = [
      !privateKey && 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
      !clientEmail && 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
      !projectId && 'FIREBASE_PROJECT_ID',
    ]
      .filter(Boolean)
      .join(', ');
    console.error(
      `Firebase Admin SDK: Missing environment variables for initialization. Check: ${missingVars}`
    );
    // In a production environment, we might want to throw to prevent the server from starting in a bad state.
    // For now, we log the error and let the lazy-loaded services handle the uninitialized state.
    return null;
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

app = initializeAdminApp()!;

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
