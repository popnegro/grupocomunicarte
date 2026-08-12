import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { app } from "./firebase-app";

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
    console.warn(
      [
        `Missing VITE_RECAPTCHA_ENTERPRISE_SITE_KEY for ${environment}.`,
        "App Check is disabled. Create a reCAPTCHA Enterprise Website key and expose it as",
        "VITE_RECAPTCHA_ENTERPRISE_SITE_KEY to enable security attestation.",
        isDebug
          ? "For Debug mode, also set VITE_FIREBASE_APPCHECK_DEBUG=true."
          : "",
      ]
        .filter(Boolean)
        .join(" ")
    );
    return null;
  }

  try {
    return initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Failed to initialize App Check:", error);
    return null;
  }
};

export const appCheck = initializeFirebaseAppCheck();
