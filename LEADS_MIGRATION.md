# Migration Report: /api/leads to v1

**ID de Tarea:** P1.2-B
**Fecha de Migración:** 2024-05-24

## 1. Resumen

Siguiendo el patrón validado con `clients`, esta migración mueve la lógica de la entidad `Lead` desde `server.ts` a la arquitectura v1.

*   **Origen (Legacy):** `/api/leads`
*   **Destino (v1):** `/api/v1/leads`

## 2. Archivos Modificados

*   **Creados:**
    *   `docs/migrations/LEADS_API_CONTRACT.md`
    *   `src/repositories/leads.repository.ts`
    *   `src/services/leads.service.ts`
    *   `src/controllers/leads.controller.ts`
    *   `docs/migrations/LEADS_MIGRATION.md`
*   **Modificados:**
    *   `src/api/v1/router.ts`: Activación de las rutas de `leads`.
    *   `src/components/DashboardView.tsx`: Actualización del endpoint de fetch para leads.
    *   `server.ts`: Comentado y marcado como obsoleto el código legacy de `/api/leads`.

## 3. Comportamiento y Contrato

El contrato funcional se ha preservado, incluyendo las relaciones con `Client` y `User` en la respuesta del `GET`. La nueva API v1 es compatible con la implementación legacy.

## 4. Estado del Código Legacy

*   **Estado:** `DEPRECATED`
*   **Ubicación:** `server.ts`
*   **Acción:** El código ha sido comentado para desactivarlo, permitiendo una reversión si es necesario.

## 5. Validación

*   **Lint & Build:** PASS.
*   **Tests:** `NOT AVAILABLE`.
*   **Smoke Test Manual:** Se verificó que `GET /api/v1/leads` y `POST /api/v1/leads` funcionan correctamente. El frontend carga y muestra los leads sin regresiones.
*   **Regresión `clients`:** Se confirmó que la migración de `leads` no afectó la funcionalidad de `/api/v1/clients`.

## 6. Deuda Restante

*   La lógica para `quotes`, `mediakits`, `screens`, y `changelogs` permanece en `server.ts`.
*   El `userId` para la creación de un lead se sigue tomando del body del request en lugar de la sesión de autenticación, para mantener la compatibilidad con el comportamiento legacy. Esto debería ser refactorizado en la fase de "Production Hardening".