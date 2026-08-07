import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

import firebaseConfig from "../../firebase-applet-config.json";

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase App Check
 *
 * Development / Firebase Studio:
 * - Enables App Check debug mode.
 * - Firebase prints a debug token in the browser console.
 * - Register that token in Firebase Console:
 *   Security → App Check → Manage debug tokens.
 *
 * Production:
 * - Uses reCAPTCHA Enterprise.
 * - Requires VITE_RECAPTCHA_ENTERPRISE_SITE_KEY.
 * - Enables automatic token refresh.
 *
 * IMPORTANT:
 * - Never commit a debug token.
 * - Never use a debug token as production authentication.
 */
const initializeFirebaseAppCheck = () => {
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    (globalThis as typeof globalThis & {
      FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
    }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  const siteKey =
    import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();

  if (!siteKey) {
    throw new Error(
      "Missing VITE_RECAPTCHA_ENTERPRISE_SITE_KEY. Configure the reCAPTCHA Enterprise Website Site Key before starting Firebase App Check.",
    );
  }

  return initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
};

/**
 * App Check MUST be initialized before Auth, Firestore or Storage.
 */
export const appCheck = initializeFirebaseAppCheck();

export const auth = getAuth(app);

const dbInstanceId = (firebaseConfig as any).firestoreDatabaseId;

export const db = dbInstanceId
  ? getFirestore(app, dbInstanceId)
  : getFirestore(app);

export const storage = getStorage(app);

export const googleAuthProvider = new GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export const googleSlidesAuthProvider = new GoogleAuthProvider();

googleSlidesAuthProvider.addScope(
  "https://www.googleapis.com/auth/presentations",
);

googleSlidesAuthProvider.addScope(
  "https://www.googleapis.com/auth/drive",
);

googleSlidesAuthProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
};