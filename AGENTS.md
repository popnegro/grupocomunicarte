# AI DEVELOPMENT INSTRUCTIONS — SMARTWEB DOOH PLATFORM

## OPERATING MODE
1. **Scope Discipline**: Implement strictly what is required or explicitly specified. Maintain high craft, accessibility, and precision.
2. **Read-Before-Write**: Always read existing code before editing. Understand structural dependencies and types.
3. **Zero Anti-Slop Policy**: Avoid generic UI tropes, arbitrary glow effects, or unhandled click states. Maintain mathematical corner radiuses, WCAG AA contrast, and responsive spacing.

---

## DEBUGGING PROCESS
1. **Root-Cause Isolation**: Trace errors from Entry Point -> Providers -> App -> Components -> API/Data.
2. **Never Mask Errors**: Do not swallow exceptions in empty `catch` blocks or mute error boundaries to force a blank screen to render.
3. **Safe Storage Parsing**: Always parse browser storage (`localStorage`, `sessionStorage`) inside `try/catch` wrappers with typed fallbacks to prevent corrupted client state from causing white screen crashes.

---

## CLEAN BUILD AND CACHE POLICY

### 1. PRINCIPIO
Después de modificaciones relevantes y antes de validar el resultado final, el proyecto debe ser comprobado mediante un **build limpio**.
No confiar exclusivamente en:
- Caché del navegador.
- Caché de Vite (`node_modules/.vite`).
- Artefactos anteriores en `dist/`.
- Cachés del package manager o deployment (Vercel/Cloud Run).

### 2. LIMPIEZA DE CACHÉ
Cuando corresponda o durante la resolución de inconsistencias:
- Limpiar cachés temporales y artefactos en `dist/` antes de compilaciones definitivas.
- No eliminar archivos de configuración (`vite.config.ts`, `package.json`, `.env.example`).
- No eliminar almacenamiento o datos persistentes de usuarios de forma indiscriminada.

### 3. BUILD LIMPIO
Ejecutar el proceso de compilación desde un estado limpio para garantizar que el resultado no dependa de artefactos obsoletos.
Comprobar:
- Resolución de imports y alias de módulos.
- Dependencias y consistencia de tipos TypeScript (`tsc --noEmit`).
- Generación limpia del bundle (`vite build` + `esbuild server.ts`).
- Declaración de variables de entorno requeridas en `.env.example`.

### 4. GESTIÓN DE DEPENDENCIAS
Si se detectan inconsistencias en `node_modules` respecto a `package.json` o el lockfile:
- Verificar la instalación de paquetes usando `install_applet_dependencies` o `install_applet_package`.
- No reinstalar ni actualizar versiones arbitrariamente para solucionar problemas de caché.

### 5. BROWSER Y SERVICE WORKER CACHE
- Verificar que las actualizaciones del bundle rompan caché adecuadamente utilizando hashes en los nombres de archivos estáticos (mecanismo nativo de Vite).
- Auditar que la aplicación no quede atrapada en Service Workers obsoletos.
- No utilizar `localStorage.clear()` indiscriminadamente como solución mágica a problemas de renderizado.

### 6. PANTALLA BLANCA (WHITE SCREEN DIAGNOSIS)
Si ocurre una pantalla blanca:
- No asumir ciegamente que es un problema de caché.
- Diagnosticar secuencialmente: Errores JS en runtime -> Excepciones en componentes React -> Errores de imports/módulos -> Excepciones en `useEffect` / estado inicial -> Errores de API / datos nulos.
- Usar la limpieza de caché para descartar variables de entorno de build, no para ocultar la causa raíz.

### 7. CACHE BUSTING
- Confiar en el hashing automático de activos de Vite (`assets/[name]-[hash].js`).
- No introducir parches con `Math.random()` o parámetros timestamp arbitrarios en imports.

### 8. INVALIDACIÓN CONTROLADA Y NO REGRESIÓN
- Identificar con precisión la capa de caché afectada (`Navegador` -> `Service Worker` -> `CDN` -> `Deployment` -> `Build`).
- Corregir únicamente la capa requerida.
- La limpieza de caché nunca debe ocultar una regresión.

---

## BUILD VALIDATION

Antes de dar por finalizada cualquier tarea de desarrollo o corrección:

1. **Linting**: Ejecutar validación de código con `npm run lint` (`tsc --noEmit`).
2. **Typecheck**: Confirmar que no existan errores de tipos TypeScript.
3. **Limpieza & Build**: Ejecutar build limpio con `npm run build`.
4. **Verificación de Artefactos**: Confirmar que los outputs en `dist/` (`index.html`, `assets/*`, `server.cjs`) sean válidos y no estén vacíos.
5. **Runtime Check**: Verificar que el servidor inicie correctamente y no lance excepciones de inicio.
6. **Regresión**: Validar que los flujos principales (autenticación, navegación, dashboard, inventario) funcionen de forma estable.

---

## PRODUCTION CHECKLIST
- [ ] Variables de entorno declaradas en `.env.example`.
- [ ] Inicialización lazy de SDKs del servidor (ej. Firebase Admin, Gemini) para evitar crashes si faltan variables.
- [ ] Servidor configurado para escuchar en `0.0.0.0:3000`.
- [ ] `dist/server.cjs` compilado correctamente mediante `esbuild`.
- [ ] `ErrorBoundary` envolviendo el árbol de React para captura elegante de excepciones en cliente.

---

## FINAL OBJECTIVE & DEFINICIÓN DE COMPLETO

Una tarea solo se considera **COMPLETA** cuando cumple exhaustivamente con:
✓ Código fuente limpio y libre de errores de sintaxis.
✓ Validaciones de linter y TypeScript en verde (`npm run lint`).
✓ Compilación exitosa de producción (`npm run build`).
✓ Verificación de build limpio y libre de artefactos o cachés corruptas.
✓ Funcionamiento de runtime verificado sin errores críticos en consola.
✓ Cero regresiones en los flujos principales de la aplicación.
