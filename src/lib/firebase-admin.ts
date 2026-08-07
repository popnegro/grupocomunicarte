import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID; // Ensure this is set in .env

  if (!privateKey || !clientEmail || !projectId) {
    console.error('Firebase Admin SDK: Missing environment variables for initialization. Check GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, and FIREBASE_PROJECT_ID.');
    // Depending on the application's robustness needs, you might want to throw an error here
    // throw new Error('Firebase Admin SDK environment variables are not properly configured.');
  } else {
    initializeApp({ // Use modular initializeApp
      credential: cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
    });
  }
}

let _auth: any = null;
let _db: any = null;

function getAdminAuth() {
  if (!_auth) {
    if (getApps().length === 0) {
      throw new Error('Firebase Admin SDK is not initialized. Please configure GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, and FIREBASE_PROJECT_ID.');
    }
    _auth = getAuth();
  }
  return _auth;
}

function getAdminFirestore() {
  if (!_db) {
    if (getApps().length === 0) {
      throw new Error('Firebase Admin SDK is not initialized.');
    }
    _db = getFirestore();
  }
  return _db;
}

// Export a Proxy that lazily invokes getAuth() when first accessed
export const adminAuth = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getAdminAuth();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

// Export a Proxy that lazily invokes getFirestore() when first accessed
export const adminDb = new Proxy({} as any, {
  get(target, prop, receiver) {
    const instance = getAdminFirestore();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});
