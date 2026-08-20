# PMV Technical Audit — 2026-08-20

## Scope

Auditoría del estado actual de `main` después del snapshot PMV del 20/08/2026. Objetivo: establecer una línea base técnica antes de modificar código y detectar bloqueos reales del PMV sin ampliar el alcance.

Snapshot registrado en:

`docs/snapshots/2026-08-20/grupocomunicarte-pmv-snapshot-2026-08-20.zip`

Blob SHA del snapshot en GitHub: `053633df306a897ce414d4db99d73f0ff32e69ce`.

> Limitación: el conector GitHub permite verificar la existencia, ruta y blob SHA del ZIP, pero no expone el contenido binario del ZIP para una auditoría interna de sus archivos. Por lo tanto, esta auditoría de código se basa en el estado actual de `main`; no se afirma una auditoría byte-a-byte del contenido interno del ZIP.

## 1. Estado actual real

### Frontend / routing

- `/` → implementado mediante `PublicSite`.
- `/nosotros/*` → implementado.
- `/soluciones/*` → implementado.
- `/soportes/*` → implementado.
- `/inventario` → implementado.
- `/login` → implementado.
- `/dashboard/*` → implementado y protegido mediante `ProtectedRoute`.

**Conclusión:** la auditoría UX/UI anterior que marcaba Login y Dashboard como `MISSING` está desactualizada y no debe utilizarse como criterio de estado actual.

### Backend

Existe backend Express integrado en `server.ts`, con:

- `/api/v1/*` como router canónico.
- `/api/*` como capa de compatibilidad PMV.
- Firebase Admin para verificación de ID tokens.
- RBAC mediante roles y permisos en PostgreSQL/Drizzle.
- endpoints de inventario, campañas, Media Kits, usuarios, tenants, ciudades, categorías, media y búsqueda.
- endpoint público de solicitud de Media Kit.
- endpoint público de leads.

### Base de datos

El esquema PostgreSQL existe y cubre:

- tenants
- users
- roles
- permissions
- user_roles
- role_permissions
- screens
- locations
- clientes
- mediakits
- campaigns
- leads
- media
- métricas
- changelogs

### Calidad de instalación

`package.json` declara Node `22.x`, scripts de `build`, `lint`/typecheck y bundling de `server.ts` mediante esbuild.

El workflow `PMV Quality Gate` ejecuta instalación, typecheck y build en PRs hacia `main`.

## 2. Hallazgos P0 / P1

### P0 — Sincronización de identidad Firebase → PostgreSQL incompleta

`AuthContext` llama a `/api/auth/sync` después del login, pero `server.ts` mantiene actualmente `/api/auth/*` como placeholder genérico.

Consecuencia:

- Firebase puede autenticar al usuario.
- El backend puede verificar el Firebase ID token.
- Pero el flujo de sincronización no crea/actualiza necesariamente el registro correspondiente en `users`.
- Las operaciones que requieren `requirePermission(...)` ejecutan `populateUserIdentity`, que exige encontrar al usuario en PostgreSQL.
- Por lo tanto, autenticación y autorización no están cerradas de extremo a extremo.

**Veredicto:** bloqueo funcional real para operaciones administrativas protegidas.

### P0 — Modo Demo no es una autenticación backend real

`AuthContext.loginAsDemo()` crea un objeto `User` artificial y tokens ficticios en el cliente. El middleware backend valida tokens mediante Firebase Admin.

Por lo tanto, el modo demo puede modificar el estado del frontend, pero no representa una sesión Firebase válida para los endpoints protegidos del backend.

Además, el login lo presenta como opción recomendada.

**Veredicto:** el modo demo debe tratarse como fixture de desarrollo, no como mecanismo de acceso al PMV productivo.

### P1 — RBAC duplicado / autoridad de autorización distribuida

El frontend determina `isAdmin` a partir de una lista de emails (`VITE_ADMIN_EMAILS` más un email por defecto), mientras que el backend dispone de RBAC basado en `users → user_roles → roles → permissions`.

Esto crea dos fuentes de verdad:

1. autorización visual/frontend;
2. autorización real/backend.

El backend debe seguir siendo la única autoridad de seguridad.

**Riesgo:** UI puede mostrar funciones administrativas que el backend posteriormente rechaza.

### P1 — Persistencia híbrida Firebase + PostgreSQL

`DashboardView` usa PostgreSQL mediante API para parte del estado y Firestore directamente para pantallas y campañas.

Esto genera dos sistemas de persistencia para el mismo dominio funcional.

**Riesgo:** divergencia de datos, debugging más difícil y comportamiento distinto entre módulos.

Para el cierre PMV no se recomienda una migración arquitectónica grande. La prioridad es estabilizar el flujo existente y evitar introducir nuevas capas.

## 3. Hallazgos P2

### P2 — Compatibilidad legacy en `server.ts`

Se mantienen placeholders para `/api/ai/*`, `/api/sync/*`, `/api/auth/*` y `/api/gmail/*`.

Mientras los módulos legacy sigan presentes, estos endpoints deben permanecer aislados y claramente diferenciados de los endpoints productivos. El problema crítico es `/api/auth/*`, porque actualmente forma parte del flujo real de login.

### P2 — Fallback de base de datos en memoria

`src/db/index.ts` entra en modo mock cuando `DATABASE_URL` no está definido.

Esto es útil para desarrollo, pero es peligroso como comportamiento silencioso de un PMV que pretende demostrar persistencia.

No se recomienda eliminarlo ahora sin una validación del entorno de despliegue; sí se recomienda que producción falle explícitamente ante ausencia de configuración crítica.

### P2 — Lead público con `tenantId` potencialmente nulo

`POST /api/leads` acepta `DEFAULT_TENANT_ID` ausente y construye el lead con `tenantId: null`.

El endpoint de Media Kit, en cambio, sí exige tenant configurado.

Debe unificarse el criterio de configuración para evitar registros públicos fuera del tenant esperado.

## 4. Estado UX/UI

El estado actual conserva la superficie pública y el sistema visual establecido. No se recomienda rediseñar ni reemplazar la UI durante la estabilización técnica.

La prioridad inmediata es:

1. login real;
2. identidad persistida;
3. permisos backend;
4. CRUD administrativo crítico;
5. validación del funnel público → lead → dashboard.

La auditoría UX/UI anterior puede conservarse como referencia histórica, pero su veredicto `PMV NOT READY` ya no refleja el estado actual del routing, backend y dashboard.

## 5. Quality Gate

El workflow existente cubre:

- Node 22
- `npm install --no-audit --no-fund`
- `npm run lint`
- `npm run build`

Existe status `Vercel: success` para el commit del snapshot `00da880c34e4d750bbc0d8bb658d80ef1be8d55e`.

## 6. Plan de cierre — mínimo y conservador

### Fase 01 — Auth real

- Implementar `/api/auth/sync` de forma idempotente.
- Crear/actualizar `users` a partir del Firebase UID.
- Asociar tenant y rol inicial de forma explícita.
- Mantener Firebase como proveedor de identidad.
- Mantener PostgreSQL/RBAC como autoridad de autorización.

### Fase 02 — Dashboard smoke test

Validar, sin rediseñar:

- login Google real;
- `/dashboard`;
- lectura de inventario;
- creación/edición/eliminación de un soporte;
- lectura de leads;
- solicitud pública de Media Kit;
- visualización del lead generado.

### Fase 03 — Cierre PMV

- retirar el modo Demo de producción o limitarlo inequívocamente a desarrollo;
- eliminar inconsistencias de tenant en endpoints públicos;
- ejecutar quality gate;
- revisar deployment Vercel;
- cerrar únicamente los blockers encontrados.

## 7. Regla de alcance

No se recomienda:

- migrar toda la arquitectura;
- reemplazar Firebase/Firestore por otra tecnología durante este cierre;
- rediseñar la interfaz pública;
- introducir nuevas funcionalidades de negocio;
- crear nuevas capas de abstracción sin necesidad demostrable.

El objetivo es **cerrar el PMV existente con el menor cambio seguro posible**.

## Veredicto

**PMV — técnicamente avanzado, pero NO listo para cierre administrativo.**

El principal bloqueo actual no es la ausencia de Login/Dashboard, sino la falta de cierre del puente **Firebase Auth → PostgreSQL User/RBAC** y la coexistencia de un **modo Demo ficticio** con un backend que exige tokens Firebase reales.
