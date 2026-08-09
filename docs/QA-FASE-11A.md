# FASE 11A — Resolución de errores TypeScript

## Alcance

Corrección exclusiva de contratos TypeScript, rutas de importación y compatibilidad del SDK Firebase Admin.

No se modificó el diseño Stitch ni la lógica funcional de Explorador, Detalle, cart, Media Kit, disponibilidad o backend comercial.

## Correcciones

1. Normalización de imports relativos desde `src/components/*` hacia `src/types`, `src/utils`, `src/constants`, `src/stores` y `src/components/ui`.
2. `ScreenCard` ahora proporciona `TYPE_STYLES` a `ScreenCardHeader`.
3. `InventoryModuleProps` acepta `isLoading` de forma opcional, preservando la llamada existente desde `DashboardView`.
4. `SoportesView` usa la firma real de `optimizeImageUrl(url)`.
5. `GmailModule` maneja correctamente `res.error === null`.
6. `src/components/dashboard/firebase-admin.ts` fue actualizado a la API modular de Firebase Admin v14, evitando `admin.apps`, `admin.credential` y `admin.auth` del namespace legacy.

## Validación

La validación original reportó 25 errores en 16 archivos. Los errores corresponden a las causas anteriores.

En el entorno de trabajo del asistente no fue posible ejecutar `npm ci` porque el registry interno no dispone de `zustand@5.0.14`. Por ello, el `npm run lint` final debe ejecutarse en el entorno del proyecto donde `npm ci` ya haya instalado las dependencias.

## Criterio de cierre

```text
npm ci             → debe ser 0
npm run lint       → debe ser 0 errores
npm run build:clean → debe completar correctamente
```

No se recomienda desplegar hasta obtener `0 errors` en `npm run lint`.
