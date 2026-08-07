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
 * - Set VITE_FIREBASE_APPCHECK_DEBUG=true.
 * - Set VITE_RECAPTCHA_ENTERPRISE_SITE_KEY to the Website Site Key.
 * - The SDK will emit a debug token in the browser console.
 * - Register that token in Firebase Console:
 *   Security -> App Check -> Web app -> Manage debug tokens.
 *
 * Production:
 * - Set VITE_FIREBASE_APPCHECK_DEBUG=false (or omit it).
 * - Set VITE_RECAPTCHA_ENTERPRISE_SITE_KEY.
 * - reCAPTCHA Enterprise is used normally.
 *
 * IMPORTANT:
 * The App Check debug mode does NOT replace the provider/site key.
 * The debug flag tells Firebase to use the registered debug token
 * instead of normal attestation. The ReCaptcha Enterprise provider
 * still needs its Website Site Key.
 */
const initializeFirebaseAppCheck = () => {
  const isDebug =
    String(import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG ?? "")
      .trim()
      .toLowerCase() === "true";

  const siteKey =
    String(import.meta.env.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY ?? "").trim();

  if (isDebug && typeof window !== "undefined") {
    (
      globalThis as typeof globalThis & {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
      }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  if (!siteKey) {
    const environment = isDebug ? "development / Firebase Studio" : "production";

    throw new Error(
      [
        `Missing VITE_RECAPTCHA_ENTERPRISE_SITE_KEY for ${environment}.`,
        "Create a reCAPTCHA Enterprise Website key and expose it as",
        "VITE_RECAPTCHA_ENTERPRISE_SITE_KEY in the environment used by Vite.",
        isDebug
          ? "For Debug mode, also set VITE_FIREBASE_APPCHECK_DEBUG=true."
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  return initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
};

/**
 * Initialize App Check before Auth, Firestore and Storage.
 */
export const appCheck = initializeFirebaseAppCheck();

/**
 * Firebase Authentication
 */
export const auth = getAuth(app);

/**
 * Cloud Firestore
 */
const dbInstanceId = (firebaseConfig as any).firestoreDatabaseId;

export const db = dbInstanceId
  ? getFirestore(app, dbInstanceId)
  : getFirestore(app);

/**
 * Cloud Storage
 */
export const storage = getStorage(app);

/**
 * Google Authentication Provider
 */
export const googleAuthProvider = new GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Google provider with Google Slides + Drive scopes.
 */
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

/**
 * Auth helpers consumed by AuthContext.tsx.
 */
export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  browserPopupRedirectResolver,
};