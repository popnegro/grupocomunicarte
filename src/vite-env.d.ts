/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_EMAILS?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FIREBASE_APPCHECK_DEBUG?: string;
  readonly VITE_RECAPTCHA_ENTERPRISE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
