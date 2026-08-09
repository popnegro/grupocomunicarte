# FASE 10 — Producción

## Objetivo

Preparar el proyecto para despliegue en Vercel sin cambiar funcionalidades ni diseño.

## Cambios técnicos

- `npm run build:clean` se usa como build de producción para eliminar `dist` antes de compilar.
- `vercel.json` declara `buildCommand` y `outputDirectory`.
- `api/index.ts` expone el backend Express como función serverless.
- `server.ts` ya no ejecuta `app.listen()` cuando Vercel importa la función (`VERCEL=1`).
- Se agregó `GET /api/health` sin exponer secretos.
- CORS admite `CORS_ORIGIN`; si no está definido mantiene compatibilidad amplia.

## Variables requeridas en Vercel

### Backend

- `DATABASE_URL` o `POSTGRES_URL`
- `DEFAULT_TENANT_ID`
- `FIREBASE_PROJECT_ID`

### Firebase / Google

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SLIDES_TEMPLATE_ID`
- `OFFICIAL_GMAIL_ACCOUNT`

### Notificaciones

- `RESEND_API_KEY`
- `SALES_NOTIFY_EMAIL`
- `RESEND_FROM_EMAIL` (recomendado)
- `CORS_ORIGIN` (recomendado en producción)

### Frontend

- `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`
- `VITE_ADMIN_EMAILS`

No colocar secretos privados en variables `VITE_*`.

## Build

Ejecutar en un entorno con acceso al registry:

```bash
npm ci
npm run lint
npm run build:clean
```

El entorno de auditoría actual no pudo completar `npm ci` porque su registry devuelve 404 para `zustand@5.0.14`. Esto es una limitación del entorno, no una validación de producción.

## Smoke test posterior al deploy

1. `GET /api/health` devuelve HTTP 200.
2. Landing carga en Desktop.
3. Landing carga en Mobile.
4. Explorador abre detalle.
5. Selección entra al cart.
6. Ubicaciones Destacadas comparte el mismo cart.
7. Media Kit vacío muestra formulario.
8. Media Kit con soportes muestra selección.
9. Solicitud válida crea un lead.
10. Error de `/api/leads` no muestra confirmación falsa.
11. Firebase/App Check funciona en producción.
12. No aparecen errores críticos en consola.
13. Vercel Functions no registran `app.listen()` ni errores de inicialización.

## Criterio de release

No marcar producción como OK hasta que:

- `npm ci` finalice correctamente.
- `npm run lint` finalice con código 0.
- `npm run build:clean` finalice con código 0.
- `/api/health` devuelva 200.
- se complete el smoke test Desktop/Mobile.
