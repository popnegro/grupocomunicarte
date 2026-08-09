# QA FASE 09 — QA integral de aplicación

## Alcance

Auditoría estática y correcciones de bajo riesgo sobre la base de Fase 08.

## Hallazgos y correcciones

### 1. Solicitudes comerciales fallidas podían mostrarse como exitosas
`useCmsStore.addLead()` devolvía `null` cuando `/api/leads` fallaba. `MediaKitView` esperaba una excepción para mostrar el estado de error.

**Corrección:** `addLead()` ahora lanza un `Error` cuando la API responde con `ok=false` o `success=false`.

Resultado:
- éxito de API → confirmación real;
- error de API → mensaje de error;
- no se presenta una solicitud fallida como enviada.

### 2. Errores HTTP no distinguían validación y rate limit
`safeFetchJson()` clasificaba todos los errores HTTP como `server`.

**Corrección:**
- HTTP 400–499 → `validation`;
- HTTP 429 → `isRateLimited=true`;
- HTTP 5xx → `server`.

### 3. Variables Vite usadas por el código no estaban declaradas
Se agregaron a `ImportMetaEnv`:
- `VITE_API_BASE_URL`
- `VITE_FIREBASE_APPCHECK_DEBUG`
- `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`

Esto elimina falsos positivos de TypeScript cuando las dependencias están instaladas.

## Flujos auditados

- Landing → Explorador → Detalle → volver.
- Landing → Ubicaciones Destacadas → Detalle.
- Selección → `cartStore`.
- `cartStore` → Media Kit.
- Media Kit vacío → solicitud general.
- Media Kit con soportes → solicitud comercial.
- Solicitud → `/api/leads`.
- HTTP error → estado de error, no confirmación falsa.
- 429 → indicador de rate limit disponible para la UI.
- Desktop/Mobile → misma fuente de verdad y mismos handlers.

## Estado de validación

No fue posible ejecutar un build completo en este paquete porque `node_modules` no está incluido y el registry disponible anteriormente no pudo resolver `zustand@5.0.14`.

Por lo tanto:
- análisis estático: realizado;
- correcciones de código: realizadas;
- build de producción: pendiente de ejecutar en entorno con dependencias.

## Criterio de cierre

Fase 09 se considera técnicamente preparada para validación en Vercel cuando:
1. `npm ci`/`npm install` finalice sin errores;
2. `npm run lint` no presente errores propios del código;
3. `npm run build` finalice correctamente;
4. se pruebe una solicitud exitosa;
5. se pruebe una solicitud con API 4xx/5xx;
6. se pruebe HTTP 429;
7. se verifique el flujo Desktop y Mobile.
