# PLAN DE IMPLEMENTACIÓN — GRUPO COMUNICARTE SAAS DOOH PLATFORM (PRODUCTION READY)

Este documento detalla el plan de migración paso a paso para elevar la arquitectura del SaaS DOOH de Grupo Comunicarte a un nivel robusto, seguro, optimizado y listo para producción en Vercel.

---

## 📋 Resumen del Estado de la Auditoría

- **Ruteador Actual**: `BrowserRouter` ya está activo en `App.tsx` en el nivel superior, pero existe un sistema de enrutamiento basado en **Hashes (`#`)** embebido en `CmsContext.tsx` que simula la navegación interna de la landing y de las pestañas del dashboard mediante `window.location.hash` y eventos `hashchange`. Esto genera URLs como `/#/soportes` o `/#/dashboard/inventario`.
- **Servidor Express (`server.ts`)**: Listo para soportar rutas dinámicas profundas de `BrowserRouter`. Tiene configuración SPA fallback `app.use(express.static(distPath))` y comodín `app.get("*", ...)` en producción, y usa Vite Express Middleware en modo SPA durante el desarrollo.
- **Vercel Config**: `vercel.json` existe pero tiene redirecciones estáticas heredadas. Debe configurarse correctamente para actuar de forma sincronizada con el SPA routing.
- **Redirecciones Crudas**: Se identificó un hard reload en `Navigation.tsx` (`window.location.href = "/dashboard"`) que destruye el estado de React y fuerza a Firebase a re-autenticar de forma costosa.
- **Módulos de Carga**: Componentes de alta densidad (`DashboardHome`, `InventoryModule`, `ClientsModule`, etc.) se importan de manera síncrona al inicio, incrementando el bundle principal inicial de forma innecesaria.

---

## 🎯 Estrategia y Objetivos de Refactorización

1. **Migración Total a Rutas Limpias (Browser Paths)**:
   - Eliminar el uso de `#` en `CmsContext.tsx`.
   - Modificar `CmsProvider` para sincronizar bidireccionalmente entre el `location.pathname` de `react-router-dom` y el estado global de Zustand (`activeSlug`, `activeView`, `currentDashboardTab`).
   - Soportar rutas reales como `/soportes`, `/nosotros`, `/dashboard/inventory`, etc.
2. **Corrección de Hard Reloads**:
   - Reemplazar `window.location.href` por `useNavigate()` en `Navigation.tsx` y en cualquier redirector.
3. **Optimización de Bundle mediante Lazy Loading**:
   - Implementar `React.lazy` y `<Suspense>` con un esqueleto pulido de carga (`DashboardSkeleton`) para todos los módulos pesados de la consola comercial.
4. **Hardenización de Firebase Auth y Token Refresh**:
   - Refactorizar `AuthContext.tsx` para usar un flujo robusto usando `onIdTokenChanged` y renovación proactiva antes de la sincronización con PostgreSQL (`/api/auth/sync`).
   - Agregar control granular de errores de autenticación comunes (expiración de tokens, popup cancelado, fallas de red).
5. **Robustez y Resiliencia**:
   - Implementar un `ErrorBoundary` de grado empresarial para capturar fallos de carga en módulos dinámicos (lazy load failure) o API.
   - Implementar un comportamiento de scroll inteligente (`ScrollRestoration` de React Router y control de vista superior).

---

## 🛠️ Archivos Afectados y Plan de Trabajo

### Fase 1: Sincronización de Enrutamiento y Fallback en Vercel
- **Archivos**: `/vercel.json`, `/src/App.tsx`, `/src/components/CmsContext.tsx`
- **Modificación**:
  - Actualizar `vercel.json` con `rewrites` específicos que protejan el prefijo `/api/*` pero redirijan todo lo demás a `/index.html`.
  - Mover `BrowserRouter` por encima de `CmsProvider` en `App.tsx` para permitir que el proveedor consuma los hooks de rutas.
  - Modificar `CmsProvider` para sincronizar reactivamente el `pathname` con Zustand en ambas direcciones, y remover los listeners manuales de `hashchange`.
- **Riesgos**: Baja probabilidad de desajuste estético, controlado mediante mapeos inversos en el sitemap.

### Fase 2: Reemplazo de Hard Reloads
- **Archivos**: `/src/components/Navigation.tsx`
- **Modificación**:
  - Importar e inyectar `useNavigate()` en el botón "Consola".
  - Reemplazar `window.location.href = "/dashboard"` por `navigate("/dashboard")`.

### Fase 3: Modularización y Layouts Modernos
- **Archivos**: `/src/App.tsx`, `/src/components/DashboardView.tsx`
- **Modificación**:
  - Asegurar la compatibilidad con rutas jerárquicas dinámicas y la navegación nativa de `react-router-dom`.

### Fase 4: Lazy Loading de Módulos Críticos y Esqueletos
- **Archivos**: `/src/components/DashboardView.tsx`
- **Modificación**:
  - Lazy load para `DashboardHome`, `InventoryModule`, `MediaKitModule`, `ClientsModule`, `SettingsModule`, `AiPlannerModule`.
  - Implementar un `<Suspense>` con un `DashboardSkeleton` refinado en el contenedor de las subrutas.

### Fase 5: Robustez en Firebase Auth (Token Refresh & Error Handling)
- **Archivos**: `/src/components/AuthContext.tsx`, `/src/components/LoginView.tsx`
- **Modificación**:
  - Implementar `onIdTokenChanged` para escuchar revocación y refresco de tokens de forma automática.
  - Asegurar la renovación del ID token antes de realizar solicitudes HTTP críticas de sincronización.
  - Añadir manejadores de excepción específicos para popups cerrados, expiración y pérdidas de conexión.

### Fase 6: Resiliencia (Error Boundaries) y Scroll
- **Archivos**: `/src/components/ErrorBoundary.tsx`, `/src/App.tsx`
- **Modificación**:
  - Crear un componente `ErrorBoundary` con UI de recuperación ("Retry") y reporte limpio.
  - Implementar `ScrollRestoration` nativo y comportamiento de scroll hacia arriba al alternar módulos.

---

## 🔄 Estrategia de Rollback y Verificación

- **Verificación Técnica**:
  - Ejecutar `npm run lint` y `npm run build` después de cada fase de forma secuencial.
  - Monitorear el servidor de desarrollo en port `3000`.
- **Estrategia de Rollback**:
  - Conservar copias de respaldo de `CmsContext.tsx` y `App.tsx` para volver al enrutador basado en hashes si se detectaran fallos críticos de ciclo de vida del estado.
