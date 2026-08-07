import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID; // Ensure this is set in .env

  if (!privateKey || !clientEmail || !projectId) {
    console.error('Firebase Admin SDK: Missing environment variables for initialization. Check GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, and FIREBASE_PROJECT_ID.');
    // Depending on the application's robustness needs, you might want to throw an error here
    // throw new Error('Firebase Admin SDK environment variables are not properly configured.');
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
    });
  }
}

export const adminAuth = admin.auth();