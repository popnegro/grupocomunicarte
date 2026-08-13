# HANDOFF — GRUPO COMUNICARTE
## Continuidad técnica, arquitectónica, UX/UI y funcional
### Fecha: 2026-08-12

---

# 1. OBJETIVO DE ESTE DOCUMENTO

Este documento permite continuar el desarrollo, auditoría y estabilización del proyecto **Grupo Comunicarte** desde otra cuenta de ChatGPT, Google AI Studio/Gemini u otro agente de desarrollo.

El agente que reciba este documento DEBE:

1. Leer este documento completo.
2. Analizar el ZIP completo del proyecto.
3. No asumir que el estado descrito aquí es correcto sin verificarlo contra el código.
4. Mantener las decisiones arquitectónicas confirmadas salvo evidencia técnica que justifique modificarlas.
5. No eliminar funcionalidades existentes sin identificar previamente su impacto.
6. No crear implementaciones paralelas cuando ya exista una implementación canónica.
7. Priorizar consolidación, eliminación de duplicados y estabilidad antes de agregar nuevas funcionalidades.
8. Auditar UX/UI además de TypeScript, arquitectura y funcionalidad.

---

# 2. PROYECTO

Nombre:

Grupo Comunicarte

Aplicación:

Plataforma SaaS para gestión de publicidad exterior / DOOH.

URL de referencia:

https://grupocomunicarte.vercel.app/

Repositorio/proyecto:

grupocomunicarte

Stack principal esperado:

- React
- TypeScript
- Vite
- Tailwind CSS
- Firebase
- Firebase Authentication
- Firestore
- Firebase Storage
- Node.js
- API backend
- Vercel
- Drizzle
- PostgreSQL/SQL según configuración del backend
- Lucide React
- componentes UI propios + componentes estilo shadcn
- Google integrations
- Google Slides
- Google Picker
- mapas / geolocalización
- inventario de soportes publicitarios
- generación de Media Kit
- gestión de leads
- clientes
- cotizaciones
- dashboard administrativo

---

# 3. PROPÓSITO DEL PMV

El producto debe funcionar como una plataforma comercial y operativa para Grupo Comunicarte.

Áreas principales:

- Landing pública
- Catálogo de soportes
- Ubicaciones
- Inventario DOOH
- Soportes LED
- Soportes móviles
- Fichas técnicas
- Disponibilidad
- Cotización
- Leads
- Clientes
- Dashboard
- Administración
- Reportes
- Revenue
- Media Kit
- Google Slides
- Google Picker
- sincronización
- autenticación
- roles/permisos
- Firebase
- APIs
- datos geográficos

---

# 4. REGLA PRINCIPAL DE CONTINUIDAD

NO comenzar una reconstrucción desde cero.

El proyecto ya contiene una cantidad importante de trabajo.

Primero:

AUDITAR → CONSOLIDAR → CORREGIR → VALIDAR → RECIÉN DESPUÉS AMPLIAR.

No duplicar:

- Firebase
- Auth
- componentes
- ScreenCard
- navegación
- servicios
- repositorios
- modelos
- APIs
- design systems

---

# 5. ESTADO DEL ZIP

Se generó:

grupocomunicarte-ai-studio.zip

Ubicación original:

/home/luisgrasso/Documentos/grupocomunicarte-ai-studio.zip

El ZIP debe contener el proyecto:

grupocomunicarte/

Debe excluir:

- node_modules
- .git
- dist
- build
- .next
- .turbo
- .cache
- .vite
- coverage
- archivos .env reales
- archivos comprimidos internos
- artefactos generados innecesarios

IMPORTANTE:

Antes de comenzar a modificar código, verificar que el ZIP no contenga entradas basura como:

--include=*.ts
--include=*.tsx
0
nombres con `\.tsx`
nombres con `\.ts`

Estas entradas aparecieron en una generación anterior y deben considerarse sospechosas.

---

# 6. ARCHIVOS IMPORTANTES

Entre los archivos existentes se encuentran:

README.md

DESIGN.md

AGENTS.md

GEMINI.md

FIGMA.md

LEADS_API_CONTRACT.md

CLIENTS_API_CONTRACT.md

QUOTES_API_CONTRACT.md

LEADS_MIGRATION.md

CLIENTS_MIGRATION.md

QUOTES_MIGRATION.md

FASE_02_P1_2_REASSESSMENT.md

HANDOFF-GRUPO-COMUNICARTE-2026-08-09.md

docs/

.ai/

fixtures/

server/

src/

---

# 7. DOCUMENTACIÓN DE DISEÑO

Existe:

DESIGN.md

y:

docs/DESIGN.md

Verificar si son idénticos.

Si contienen información duplicada, NO eliminar automáticamente.

Primero determinar cuál es el documento canónico.

La documentación relacionada con Stitch / Design System / UX debe mantenerse coherente con la implementación real.

---

# 8. FIREBASE — DECISIÓN ARQUITECTÓNICA

Se realizó una consolidación del sistema de autenticación Firebase.

La implementación canónica acordada es:

src/lib/firebase.ts

El objetivo fue eliminar discrepancias, duplicaciones y marcadores latentes entre distintas implementaciones de Firebase Auth.

Sin embargo:

NO asumir que la consolidación está técnicamente completa.

Debe auditarse el código real.

Archivos Firebase actualmente presentes incluyen:

src/lib/firebase.ts

src/lib/firebase-app.ts

src/lib/firebase-auth.ts

src/lib/firebase-auth-core.ts

src/lib/firebase-google-auth.ts

src/lib/firebase-storage.ts

src/lib/firebase-app-check.ts

src/lib/firebase-firestore.ts

src/components/AuthContext.tsx

src/components/Auth.tsx

src/components/LazyAuthContext.tsx

src/components/LazyAuthProvider.tsx

server/firebase-admin.ts

src/components/dashboard/firebase-admin.ts

IMPORTANTE:

La existencia de estos archivos NO significa que todos deban eliminarse.

Determinar:

- responsabilidad de cada archivo
- imports
- exports
- dependencias
- consumidores
- si existen implementaciones duplicadas
- si hay ciclos
- si hay dos fuentes de verdad

La regla es:

UNA fuente canónica por responsabilidad.

---

# 9. FIREBASE AUTH — AUDITORÍA OBLIGATORIA

Verificar:

1. Inicialización Firebase App.
2. Firebase Auth.
3. Google Provider.
4. persistencia de sesión.
5. logout.
6. refresh.
7. AuthContext.
8. guards.
9. Lazy Auth.
10. server-side Firebase Admin.
11. RBAC.
12. manejo de errores.
13. variables de entorno.
14. imports.
15. exports.
16. referencias a implementaciones antiguas.

Buscar especialmente:

firebase.ts
firebase-auth.ts
firebase-auth-core.ts
firebase-google-auth.ts
AuthContext.tsx
LazyAuthContext.tsx
LazyAuthProvider.tsx

No crear otro Firebase Auth provider si ya existe uno funcional.

---

# 10. FRONTEND

Entrada principal esperada:

src/main.tsx

Aplicación:

src/App.tsx

Auditar:

- routing
- navegación
- layouts
- lazy loading
- Suspense
- error boundaries
- estado global
- stores
- componentes duplicados
- imports
- paths
- componentes UI
- responsive design
- accesibilidad
- performance

---

# 11. COMPONENTES POTENCIALMENTE DUPLICADOS

Existen componentes con nombres similares.

Ejemplos:

ScreenCard.tsx

ScreenCardBody.tsx

ScreenCardHeader.tsx

ScreenCardFooter.tsx

y también:

src/components/screencard/

con:

ScreenCardBody.tsx
ScreenCardHeader.tsx
ScreenCardFooter.tsx
ScreenDetailDialog.tsx
TechnicalSpecs.tsx
AvailabilityTimeline.tsx
LocationBenefits.tsx
MobileRoute.tsx

Debe determinarse cuál es la implementación canónica.

NO borrar duplicados hasta revisar imports.

---

# 12. COMPONENTES DE LANDING

Existe:

src/components/landing/

Incluye elementos como:

Hero.tsx

InventoryCatalog.tsx

SpecsOverlay.tsx

StitchExplorerPanel.tsx

StitchFeaturedLocations.tsx

ZeroBaseRedesign.tsx

Debe revisarse la coexistencia entre:

- landing anterior
- rediseño Stitch
- Zero Base
- componentes nuevos

Objetivo:

UNA experiencia pública coherente.

No deben coexistir dos diseños visuales incompatibles sin una razón explícita.

---

# 13. DASHBOARD

Existe:

src/components/dashboard/

Incluye módulos para:

- Inventory
- Settings
- Sync
- Calendar
- Locations
- Leads
- Administration
- Reports
- LED móvil
- Revenue
- AI Planner
- Slides Sync
- Media Kit
- Clients
- Gmail
- Google Picker
- Workflow
- Dashboard Home

El dashboard debe auditarse funcionalmente.

Para cada módulo determinar:

- ¿existe?
- ¿renderiza?
- ¿tiene datos reales?
- ¿usa mock data?
- ¿tiene API?
- ¿tiene persistencia?
- ¿maneja errores?
- ¿es accesible?
- ¿es responsive?
- ¿está conectado al backend?
- ¿está conectado a Firebase?
- ¿está listo para producción?

---

# 14. DATOS DE SOPORTES

El proyecto posee datos geográficos.

Archivos existentes incluyen:

mendoza.csv

mendoza-latlng.csv

ledmovil-mendoza.csv

ledmovil-mendoza-latlng.csv

buenos-aires.csv

buenos-aires-latlng.csv

fixtures/

También:

fixtures/mendoza.import.json

fixtures/mendoza.schema.import.json

fixtures/ledmovil-mendoza.import.json

fixtures/ledmovil-mendoza.schema.import.json

fixtures/buenos-aires.import.json

fixtures/buenos-aires.schema.import.json

IMPORTANTE:

Cada soporte publicitario debe conservar información de ubicación GPS cuando corresponda.

La regla de GPS aplica a TODOS los soportes.

No implementar GPS solamente para LED móvil.

---

# 15. SOPORTES PUBLICITARIOS

El sistema debe poder representar correctamente:

- tipo de soporte
- ubicación
- coordenadas GPS
- dimensiones
- formato
- características técnicas
- disponibilidad
- precio
- fotografías
- descripción
- audiencia
- beneficios
- estado
- categoría

Los datos reales deben prevalecer sobre mocks cuando estén disponibles.

---

# 16. LED MÓVIL

LED móvil es una categoría específica.

Debe existir información relacionada con:

- ubicación
- recorrido
- cobertura
- dimensiones
- características
- disponibilidad
- material visual
- datos comerciales

Existe:

ledmovil-mendoza.csv

y fixtures específicos.

No confundir:

LED móvil

con:

soporte fijo.

---

# 17. MAPAS

Existe:

InteractiveMap.tsx

También hay datos lat/lng.

Auditar:

- renderizado
- performance
- errores Leaflet/map provider
- coordenadas
- markers
- mobile
- accesibilidad
- fallback
- datos incompletos
- SSR/client boundaries si corresponden

---

# 18. BACKEND

Existe:

server/

y también:

server.ts

Auditar la coexistencia.

Estructura actual incluye:

server/controllers/

server/middleware/

server/api/v1/

server/services/

server/repositories/

server/validation/

Debe verificarse cuál es el entrypoint real de producción.

No mantener dos arquitecturas backend paralelas sin justificación.

---

# 19. API

Existe:

server/api/v1/router.ts

Debe revisarse:

- rutas
- middleware
- autenticación
- autorización
- validación
- errores
- rate limiting
- logging
- cache
- controllers
- servicios
- repositories

---

# 20. AUTH BACKEND

Existe:

server/middleware/auth.ts

También:

server/middleware/rbac.ts

Auditar:

- requireAuth
- requireRole
- token validation
- Firebase Admin
- autorización
- exports
- imports

Hubo previamente errores relacionados con:

Module "../../middleware/auth.ts" has no exported member requireAuth

Por lo tanto este punto es prioritario.

---

# 21. QUOTES

Existe arquitectura para cotizaciones:

server/controllers/quotes.controller.ts

server/services/quotes.service.ts

server/repositories/quotes.repository.ts

server/validation/quotes.validator.ts

quotes.ts

quotes.controller.ts

QUOTES_API_CONTRACT.md

QUOTES_MIGRATION.md

Debe verificarse si los archivos raíz y los archivos server representan implementaciones duplicadas.

Objetivo:

UNA arquitectura canónica de Quotes.

---

# 22. LEADS

Existe:

leads.ts

leads.controller.ts

leads.repository.ts

leads.service.ts

LEADS_API_CONTRACT.md

LEADS_MIGRATION.md

También existe:

server/controllers/

Debe auditarse la duplicación entre raíz y server.

---

# 23. CLIENTS

Existe:

clients.controller.ts

clients.repository.ts

clients.service.ts

CLIENTS_API_CONTRACT.md

CLIENTS_MIGRATION.md

También:

server/repositories/

server/controllers/

Determinar arquitectura canónica.

---

# 24. DATABASE

Existe:

src/db/

Incluye:

schema.ts

users.ts

drizzle.config.ts

index.ts

migrations/

SCHEMA_DOCUMENTATION.md

También:

drizzle/

Debe revisarse si existen dos ubicaciones de migraciones.

Verificar:

- schema
- migrations
- conexión
- variables de entorno
- repositories
- compatibilidad
- producción

---

# 25. GOOGLE INTEGRATIONS

Existen funcionalidades para:

- Google Slides
- Google Picker
- Gmail
- sincronización

Archivos relacionados:

src/lib/google-picker.ts

src/hooks/useGooglePicker.ts

src/hooks/useGoogleSync.ts

src/components/dashboard/GooglePickerButton.tsx

src/components/dashboard/SlidesSyncModule.tsx

src/components/dashboard/GmailModule.tsx

server/services/googleSlidesBackend.ts

Auditar OAuth, permisos, errores y variables de entorno.

No eliminar estas integraciones.

---

# 26. MEDIA KIT

Existe:

src/utils/mediaKitExport.ts

src/components/MediaKitView.tsx

src/components/dashboard/MediaKitModule.tsx

server/repositories/mediaKitRelations.ts

Debe verificarse:

- exportación
- datos
- imágenes
- fichas
- disponibilidad
- información GPS
- integración con soportes
- integración con clientes
- integración con Google Slides si corresponde

---

# 27. UX/UI

La aplicación debe alcanzar una calidad visual premium.

Objetivos:

- jerarquía visual clara
- navegación intuitiva
- consistencia
- responsive
- accesibilidad
- contraste WCAG
- tipografía coherente
- espaciado consistente
- estados loading
- empty states
- error states
- feedback
- microinteracciones
- botones claramente accionables
- formularios comprensibles

Evitar:

- exceso de texto
- dashboards saturados
- cards innecesarias
- componentes visualmente inconsistentes
- botones sin jerarquía
- colores sin función
- interfaces genéricas de IA

---

# 28. DESIGN SYSTEM

Existe:

src/design-system/

Incluye:

components/
tokens/
providers/
hooks/

También:

src/lib/designSystem.ts

Debe determinarse si existen dos sistemas de diseño.

Objetivo:

UN design system.

Revisar:

- colores
- typography
- spacing
- radius
- shadows
- breakpoints
- animations
- components
- ThemeProvider

---

# 29. ACCESIBILIDAD

Auditar conforme a WCAG 2.2 AA cuando sea razonable.

Verificar:

- contraste
- focus visible
- keyboard navigation
- labels
- aria
- semantic HTML
- headings
- buttons
- links
- dialogs
- forms
- error messages
- touch targets
- reduced motion
- screen readers

No considerar accesibilidad solamente como contraste.

---

# 30. RESPONSIVE

Verificar como mínimo:

- 320 px
- 375 px
- 390 px
- 430 px
- 768 px
- 1024 px
- 1280 px
- 1440 px

Especial atención:

- navegación
- dashboard
- mapas
- cards
- tablas
- dialogs
- formularios
- Media Kit
- inventario
- filtros

---

# 31. ERRORES PREVIOS CONOCIDOS

En iteraciones anteriores aparecieron problemas como:

- Cannot find module ./components/ui/card
- Cannot find module lucide-react
- Cannot find module motion/react
- duplicate state declaration
- JSX fragment closing errors
- startTour not defined
- favicon 404
- /api/leads devolviendo HTML en lugar de JSON
- Leaflet errors
- Rollup parse errors
- ScreenCard import issues
- db schema export issues
- zod missing
- requireAuth export issue
- Firebase Admin env missing
- SQL env missing
- chunk size warnings

NO asumir que siguen existiendo.

Ejecutar primero:

npm install

npm run build

y, si corresponde:

npm run typecheck

o:

npx tsc --noEmit

según scripts disponibles en package.json.

---

# 32. VARIABLES DE ENTORNO

NO exponer secretos.

Nunca incluir en commits o ZIP:

.env
.env.local
.env.production
.env.development

Mantener:

.env.example

Auditar las variables requeridas.

Especial atención:

Firebase

Firebase Admin

Database

Google OAuth

Google Picker

Google Slides

Mercado Pago si existe

APIs externas

---

# 33. VERCEL

El proyecto utiliza Vercel.

Existe:

vercel.json

Debe verificarse:

- build command
- output directory
- rewrites
- API routing
- SPA fallback
- environment variables
- server functions
- Node runtime

No modificar routing de Vercel sin comprobar cómo funciona actualmente el frontend y backend.

---

# 34. REGLA PARA AUTOMATE MODE

Si se trabaja con Gemini / Google AI Studio Automate Mode:

NO ejecutar una reconstrucción indiscriminada.

Orden recomendado:

1. Inventory.
2. Build.
3. TypeScript.
4. Imports.
5. Firebase.
6. Routing.
7. Backend.
8. APIs.
9. Data.
10. UX/UI.
11. Accessibility.
12. Responsive.
13. Performance.
14. Final QA.

Cada cambio debe ser pequeño y verificable.

---

# 35. PROTOCOLO DE AUDITORÍA

Primera fase:

AUDITORÍA SIN MODIFICAR.

Entregar:

A. Errores críticos.
B. Errores de compilación.
C. Duplicaciones.
D. Arquitectura.
E. Firebase.
F. Backend.
G. APIs.
H. Datos.
I. UX/UI.
J. Accesibilidad.
K. Responsive.
L. Performance.
M. Seguridad.
N. Funcionalidades faltantes.

Después de la auditoría:

proponer plan de corrección.

NO comenzar por rediseñar visualmente si existen errores estructurales.

---

# 36. CRITERIO DE PRIORIDAD

P0 — Bloqueante

- build roto
- runtime crash
- auth rota
- datos perdidos
- API rota
- seguridad crítica

P1 — Alta

- funcionalidad principal incompleta
- rutas rotas
- Firebase inconsistente
- backend inconsistente
- datos incorrectos
- errores de UX graves

P2 — Media

- UX/UI
- accesibilidad
- responsive
- performance
- refactor

P3 — Baja

- polish
- microinteracciones
- documentación secundaria
- optimizaciones menores

---

# 37. REGLAS DE REFACTOR

Antes de eliminar cualquier archivo:

1. Buscar imports.
2. Buscar exports.
3. Buscar referencias.
4. Determinar si tiene consumidores dinámicos.
5. Confirmar reemplazo.
6. Ejecutar build.
7. Ejecutar tests/QA.

No borrar por nombre parecido.

---

# 38. REGLA DE FUENTE ÚNICA

Para cada dominio debe existir una única fuente canónica.

Ejemplos:

Auth → Firebase/Auth canonical implementation.

ScreenCard → una implementación canónica.

Quotes → server architecture canonical.

Clients → server architecture canonical.

Leads → server architecture canonical.

Design System → una implementación canónica.

Navigation → una arquitectura canónica.

No mantener duplicados simplemente porque "funcionan".

---

# 39. DATOS REALES

El proyecto posee información real de soportes publicitarios.

NO reemplazar datos reales por mocks durante una refactorización.

Los mocks solamente deben utilizarse cuando:

- estén explícitamente identificados
- exista fallback
- no oculten errores de integración

---

# 40. GPS

REQUISITO FUNCIONAL:

Todos los soportes deben poder tener ubicación GPS.

Esto incluye:

- soportes fijos
- soportes digitales
- LED
- LED móvil
- otras categorías

Los datos GPS deben mantenerse en:

- inventario
- fichas
- mapas
- catálogo
- Media Kit cuando corresponda

---

# 41. SEO / GEO

La landing pública debe ser preparada para:

- SEO tradicional
- Google
- búsqueda local
- GEO / generative search

Auditar:

- title
- description
- canonical
- Open Graph
- structured data
- sitemap
- robots
- headings
- semantic content
- páginas de ubicaciones
- páginas de soportes
- datos geográficos

Existe:

src/lib/sitemap.ts

---

# 42. PWA / BRANDING

Auditar:

- favicon
- favicon.svg
- manifest
- Open Graph
- metadata
- branding
- logo
- app icons

Evitar referencias antiguas.

---

# 43. COMANDOS INICIALES

Después de extraer el proyecto:

cd grupocomunicarte

npm install

npm run build

npx tsc --noEmit

Si los scripts son diferentes, leer:

package.json

antes de ejecutar comandos alternativos.

---

# 44. VERIFICACIÓN DE ZIP

Comprobar:

unzip -l grupocomunicarte-ai-studio.zip

Buscar basura:

unzip -l grupocomunicarte-ai-studio.zip | grep -E \
'--include=|/0$|node_modules|\.git/|dist/|build/|\.next/|\.turbo/|\.cache/|\.vite/|coverage/'

El resultado esperado para las exclusiones debe ser vacío.

---

# 45. NO MODIFICAR SIN AUDITORÍA

No modificar inmediatamente:

- Firebase
- arquitectura backend
- database
- routing
- datos de inventario
- fixtures
- Google integrations
- Media Kit
- authentication
- Vercel configuration

Primero comprender el sistema.

---

# 46. ENTREGABLE DE CADA ITERACIÓN

Cada fase debe terminar con:

## Cambios

Lista exacta de archivos modificados.

## Motivo

Por qué se modificaron.

## Problemas resueltos

Errores corregidos.

## Problemas pendientes

Lo que todavía no está resuelto.

## Validación

Resultados de:

- build
- TypeScript
- tests
- lint
- runtime
- UX
- accessibility

## Riesgos

Posibles regresiones.

---

# 47. ESTADO ESPERADO DEL PROYECTO

El objetivo final es obtener:

BUILD GREEN

TYPECHECK GREEN

AUTH GREEN

API GREEN

DATA GREEN

ROUTING GREEN

UX/UI CONSISTENT

ACCESSIBILITY ACCEPTABLE

RESPONSIVE

PRODUCTION READY

DOCUMENTATION CONSISTENT

---

# 48. PRIMERA ORDEN PARA EL NUEVO AGENTE

Ejecutar exactamente este proceso:

### PASO 1

Leer:

README.md

AGENTS.md

GEMINI.md

DESIGN.md

docs/

.ai/

### PASO 2

Inspeccionar:

package.json

vite.config.ts

tsconfig.json

vercel.json

### PASO 3

Auditar:

src/

server/

### PASO 4

Ejecutar:

npm install

npm run build

npx tsc --noEmit

### PASO 5

Auditar Firebase.

### PASO 6

Auditar duplicaciones.

### PASO 7

Auditar funcionalidades.

### PASO 8

Auditar UX/UI.

### PASO 9

Auditar accesibilidad.

### PASO 10

Presentar:

# AUDITORÍA DE CONTINUIDAD — GRUPO COMUNICARTE

con:

P0
P1
P2
P3

y NO modificar código todavía.

---

# 49. REGLA FINAL

Este documento es un HANDOFF.

No constituye una garantía de que el código esté correcto.

La fuente de verdad final es:

EL CÓDIGO REAL DEL PROYECTO.

Por lo tanto:

HANDOFF → CONTEXTO

ZIP → FUENTE DEL CÓDIGO

BUILD → VALIDACIÓN TÉCNICA

RUNTIME → VALIDACIÓN FUNCIONAL

QA → VALIDACIÓN FINAL

No asumir que una funcionalidad está terminada simplemente porque aparece documentada.

---

# FIN DEL HANDOFF