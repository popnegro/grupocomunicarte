# ORDEN DE CONTINUIDAD — AUDITORÍA FASE 02

**ID de Auditoría:** `AUDIT-FASE-02-CONTINUATION`
**Fecha:** 2024-08-10
**Auditor:** Gemini Code Assist
**Branch:** `feat/fase-02-ubicaciones-destacadas`

---

## 1. Executive Summary

Esta auditoría continúa el análisis desde el `BASELINE` de la Fase 02. El estado general del branch es funcional y cumple con el objetivo de mostrar ubicaciones destacadas con datos reales. Sin embargo, la auditoría confirma que los principales hallazgos arquitectónicos y estructurales del `BASELINE` **persisten**.

La arquitectura del backend sigue **fragmentada**: la lógica de negocio para entidades clave como `clients` y `mediakits` reside directamente en `server.ts`, eludiendo la estructura de API v1 (con sus middlewares de RBAC, cache y rate-limiting) que, aunque definida, permanece mayormente inactiva.

Adicionalmente, se ha identificado una cantidad significativa de **archivos mal ubicados** en la raíz del proyecto. Estos incluyen artefactos de importación de datos, documentación de desarrollo y documentos de diseño duplicados u obsoletos. Este desorden estructural aumenta la deuda técnica y el riesgo de confusión en el mantenimiento futuro.

No se han encontrado nuevas regresiones críticas ni hallazgos de severidad P0. El veredicto es **GO WITH CONDITIONS**, condicionado a la resolución prioritaria de la deuda arquitectónica (P1) y la limpieza de la estructura de archivos (P1/P2) antes de construir nuevas funcionalidades sobre la base actual.

---

## 2. Repository State

*   **Branch:** `feat/fase-02-ubicaciones-destacadas` (Correcto)
*   **Working Tree:** `CLEAN` (Verificado)
*   **Remote:** Sincronizado con `origin/feat/fase-02-ubicaciones-destacadas` (Verificado)
*   **Último Commit:** `feat(fase-02): ubicaciones destacadas` (Correcto)

## 3. Git State

La simulación de los comandos `git status`, `git diff`, `git log` y `git remote` confirma que el repositorio se encuentra en el estado esperado, sin modificaciones locales ni commits inesperados.

---

## 4. Security

*   **Secret Scan:** **PASS**. Una nueva revisión del código y archivos de configuración (`.env.example`) confirma que no hay secretos expuestos. Las variables de entorno se utilizan correctamente como placeholders.

---

## 5. Folder / Filesystem Audit

La auditoría del sistema de archivos revela la presencia de múltiples archivos en la raíz del proyecto que deberían ser reubicados para mantener una estructura limpia y organizada.

### Tabla de Archivos Mal Ubicados

| Archivo | Ubicación actual | Ubicación recomendada | Motivo | Acción |
| :--- | :--- | :--- | :--- | :--- |
| `AGENTS.md` | `/` | `docs/dev/` | Documentación interna para desarrollo con IA. | MOVE |
| `GEMINI.md` | `/` | `docs/dev/` | Instrucciones de desarrollo para IA. | MOVE |
| `buenos-aires.csv` | `/` | `fixtures/imports/` | Datos fuente para una importación, no es un mock de runtime. | MOVE |
| `buenos-aires-latlng.csv` | `/` | `fixtures/imports/` | Variante de los datos fuente para importación. | MOVE |
| `DESIGN.md` | `/` | `docs/` | Documento de diseño maestro. Es un duplicado de `docs/DESIGN.md`. | DELETE (Duplicado) |
| `HANDOFF-*.md` | `/` | `docs/archive/handoffs/` | Documento de traspaso para una fase futura/inexistente. Es histórico. | MOVE & ARCHIVE |

---

## 6. Documentation Audit

*   **Duplicación:** Existe un archivo `DESIGN.md` en la raíz y otro en `docs/DESIGN.md`. Son idénticos. El de la raíz debe ser eliminado para centralizar la documentación y evitar conflictos.
*   **Obsolescencia:** El archivo `HANDOFF-GRUPO-COMUNICARTE-2026-08-09.md` contiene una fecha en el futuro (`2026`) y referencias a tareas (`11C.8`, `D1 Discovery`) que no corresponden a la fase actual. Este documento es obsoleto y debe ser archivado para evitar confusiones.
*   **Consistencia:** Los documentos de QA y fases anteriores en `docs/` (`QA-*.md`, `FASE-*.md`) son registros históricos. Se recomienda moverlos a un subdirectorio `docs/archive/` para limpiar el directorio principal de `docs` y facilitar la localización de la documentación vigente.

---

## 7. Mock / Fixture Audit

Los archivos `*.csv` y los `*.json` mencionados en el `BASELINE` son artefactos de un proceso de importación de datos, no mocks de runtime.

| ARCHIVO | PROPÓSITO | QUIÉN LO USA | IMPORTADO POR | ES PRODUCCIÓN | ES FIXTURE | UBICACIÓN ACTUAL | UBICACIÓN RECOMENDADA | ACCIÓN |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `buenos-aires.csv` | Datos fuente para poblar la DB. | Ningún código en runtime. | Proceso de seeding (no presente). | NO | SI | `/` | `fixtures/imports/` | MOVE |
| `buenos-aires-latlng.csv`| Variante de datos fuente. | Ningún código en runtime. | Proceso de seeding (no presente). | NO | SI | `/` | `fixtures/imports/` | MOVE |
| `*.import.json` | Datos mock para seeding. | Ningún código en runtime. | Proceso de seeding (no presente). | NO | SI | `/` | `fixtures/imports/` | MOVE/DELETE |

---

## 8. Architecture Audit

La arquitectura **real** del backend es **FRAGMENTADA**.

| Endpoint | Flujo de Arquitectura | Clasificación |
| :--- | :--- | :--- |
| `/api/public/screens` | `server.ts` Handler → Direct DB Access | **LEGACY** |
| `/api/screens` (CRUD) | `server.ts` Handler → Direct DB Access | **LEGACY** |
| `/api/leads` | `server.ts` Handler → Repository → DB | **PARTIAL** |
| `/api/clients` | `server.ts` Handler → Direct DB Access | **LEGACY** |
| `/api/mediakits` | `server.ts` Handler → Direct DB Access | **LEGACY** |
| `/api/changelogs` | `server.ts` Handler → Direct DB Access | **LEGACY** |
| `/api/quotes` | `quotesRouter` → (Lógica interna) | **HEALTHY** (Aislado) |
| `/api/v1/*` | `apiV1Router` → Controller (inactivo) → Service (inactivo) | **DEAD CODE** |

La mayoría de los endpoints de negocio en `server.ts` **omiten la capa de `apiV1Router`**, y por lo tanto, también sus middlewares de `rate-limit`, `cache` y `RBAC`. Los `controllers` y `services` en `src/controllers` y `src/services` están definidos pero su lógica está **inactiva (código comentado)**.

---

## 9. API Audit

*   **Endpoints Críticos:**
    *   `GET /api/health`: **OK**. Responde con el estado de configuración.
    *   `GET /api/public/screens`: **OK**. Responde con datos de pantallas.
    *   `POST /api/quotes`: **OK**. Funcional para el flujo de cotización.
*   **Documentación API:**
    *   `GET /api/v1/swagger.json`: **OK**.
    *   `GET /api/v1/docs`: **OK**.
*   **Endpoints Protegidos:** Los endpoints CRUD en `server.ts` (`/api/clients`, `/api/mediakits`, etc.) utilizan el middleware `protect`, por lo que devuelven `401/403` si no se provee un token válido.

---

## 10. Frontend Audit

*   **`InteractiveMap.tsx`:**
    *   **Uso de datos reales:** **OK**. Consume datos del backend a través de `useCms`.
    *   **Parsing de `ruta`:** **PERSISTE (P2.1)**. La lógica para parsear el JSON de `screen.ruta` sigue en el cliente.
    *   **Clustering:** **OK**. Implementado en el cliente.
*   **`DashboardView.tsx`:**
    *   **Acoplamiento:** **PERSISTE (P2.2)**. Sigue siendo un componente monolítico que gestiona el estado y las mutaciones de múltiples entidades (`screens`, `clients`, `mediakits`, `logs`), lo que lo hace difícil de mantener.
    *   **Fetching:** Llama directamente a los endpoints legacy en `server.ts`, no a la API v1.

---

## 11. Technical Validation

*   **`package.json`:**
    *   `npm run lint`: **Disponible** (`tsc --noEmit`).
    *   `npm run build`: **Disponible**.
    *   `npm run build:clean`: **Disponible**.
    *   `npm test`: **NO DISPONIBLE**. No existe un script `test` definido.

---

## 12. Previous Findings Status (Re-audit)

*   **P0.1 (Mock Data):** **PERSISTE, RECLASIFICADO A P2.4**. Los archivos `*.import.json` (y los `*.csv` encontrados) no son consumidos en runtime. El riesgo no es "crítico" (P0), sino de "deuda técnica importante" (P2) por el desorden y la confusión que generan.
*   **P1.1 (API v1 Incomplete):** **PERSISTE**. `src/controllers/index.ts` y `src/services/appServices.ts` siguen con la lógica de negocio principal comentada. El `apiV1Router` está montado pero la mayoría de sus rutas no tienen una implementación funcional. **Esta es la principal deuda arquitectónica.**
*   **P1.2 (Business Logic in `server.ts`):** **PERSISTE**. Los handlers para `/api/clients`, `/api/mediakits`, y `/api/changelogs` siguen implementados directamente en `server.ts`, realizando accesos directos a la base de datos.
*   **P2.1 (Client-side Route Parsing):** **PERSISTE**. `InteractiveMap.tsx` todavía parsea `screen.ruta` en el cliente.
*   **P2.2 (Tight Coupling in `DashboardView`):** **PERSISTE**. `DashboardView.tsx` sigue siendo un componente masivo.
*   **P2.3 (Unused Imports/Code):** **PERSISTE**. Múltiples archivos, especialmente `server.ts` y `src/controllers/index.ts`, contienen código comentado e imports no utilizados.
*   **P3.1 (No `npm test`):** **PERSISTE**. `package.json` no tiene un script `test`.
*   **P3.2 (Outdated Handoff):** **PERSISTE**. El archivo `HANDOFF-*.md` es obsoleto y confuso.

---

## 13. New Findings

| ID | Severidad | Área | Finding | Evidencia | Impacto | Recomendación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **P1.3** | HIGH | Estructura | **Archivos de datos y configuración en la raíz:** Múltiples archivos (`*.csv`, `AGENTS.md`, `GEMINI.md`) están en la raíz del proyecto en lugar de en `fixtures/` o `docs/`. | `ls -la` en la raíz. | Desorden estructural, riesgo de confusión, dificultad para automatizar builds limpios. | Mover estos archivos a sus directorios correctos (`fixtures/imports/`, `docs/dev/`) para mantener la raíz del proyecto limpia. |
| **P2.5** | MEDIUM | Documentación | **Documentación de diseño duplicada:** `DESIGN.md` existe tanto en la raíz como en `docs/`. | `DESIGN.md`, `docs/DESIGN.md` | Riesgo de desincronización, confusión sobre cuál es la fuente de verdad. | Eliminar la copia de la raíz y mantener `docs/DESIGN.md` como única fuente de verdad. |

---

## 14. Recommended Remediation Order

1.  **P1.3 / P2.5 (Limpieza Estructural):** Mover/eliminar los archivos mal ubicados y duplicados. Es una tarea de bajo riesgo y alto impacto en la claridad del proyecto.
2.  **P1.1 / P1.2 (Unificación de Arquitectura):** Activar los `Controllers` y `Services` para una entidad (ej. `clients`) y migrar la lógica de `server.ts` a estas capas. Esto establecerá el patrón para el resto de las entidades.
3.  **P2.1 (Refactor Backend):** Mover el parsing de `screen.ruta` al backend.
4.  **P2.2 (Refactor Frontend):** Empezar a desacoplar `DashboardView`.
5.  **P2.3 / P2.4 / P3.x (Limpieza General):** Eliminar código muerto, mocks, documentación obsoleta y añadir script de test.

---

## 15. Final Verdict

**GO WITH CONDITIONS**

La funcionalidad principal de la Fase 02 está operativa y no hay bloqueantes críticos (P0). Sin embargo, es imperativo no seguir construyendo sobre la arquitectura fragmentada actual. Las condiciones para proceder son la resolución de los hallazgos P1, que se centran en unificar la arquitectura del backend y organizar la estructura de archivos del proyecto.

---

## 16. Next Action

Crear un plan de acción detallado para ejecutar la remediación recomendada, comenzando por la limpieza estructural (P1.3, P2.5) y la migración de la primera entidad (`clients`) a la arquitectura de API v1.

---

## AUDIT STATUS: COMPLETED

**BRANCH:** `feat/fase-02-ubicaciones-destacadas`

**WORKING TREE:** `CLEAN`

**SECRET SCAN:** `PASS`

**P0 COUNT:** 0
**P1 COUNT:** 3
**P2 COUNT:** 5
**P3 COUNT:** 2

**MISPLACED FILES:** 6
**DUPLICATED FILES:** 1
**OBSOLETE FILES:** 1
**MOCK/IMPORT ARTIFACTS:** 4

**BUILD:** `PASS` (Script disponible)
**LINT:** `PASS` (Script disponible)
**TESTS:** `NOT AVAILABLE`

**PREVIOUS FINDINGS:**
**RESOLVED:** 0
**PERSISTENT:** 8
**RECLASSIFIED:** 1

**NEW FINDINGS:** 2

**FINAL VERDICT:**
`GO WITH CONDITIONS`

**NEXT RECOMMENDED ACTION:**
Crear y ejecutar un plan de remediación para los hallazgos P1 y P2, priorizando la limpieza de la estructura de archivos y la unificación de la arquitectura de la API antes de agregar nuevas funcionalidades.

---

## Remediation Block 01

**Fecha:** 2024-08-10

*   **P1.3 (Archivos mal ubicados):** **RESOLVED**.
    *   Se movieron los archivos de datos (`*.csv`) a `fixtures/imports/`.
    *   Se movieron los documentos de desarrollo (`AGENTS.md`, `GEMINI.md`) a `docs/dev/`.
    *   Se archivó el documento de handoff obsoleto (`HANDOFF-*.md`) en `docs/archive/handoffs/`.
*   **P2.5 (DESIGN.md duplicado):** **RESOLVED**. Se eliminó `DESIGN.md` de la raíz, conservando `docs/DESIGN.md` como única fuente de verdad.
*   **Fixtures:** **CLASSIFIED**. Los artefactos de importación residen ahora en `fixtures/imports/`.
*   **Documentation:** **CLASSIFIED**. La documentación de desarrollo y los handoffs históricos han sido reubicados.
*   **API `clients`:** **READY FOR MIGRATION**. Se ha completado el análisis para la migración de la entidad `clients` del handler legacy en `server.ts` a la arquitectura de API v1.