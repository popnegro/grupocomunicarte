# 01. REGLA ABSOLUTA

NO reconstruyas el proyecto desde cero.

NO reemplaces la arquitectura existente sin justificación.

NO elimines funcionalidades existentes porque no coincidan exactamente con el diseño esperado.

NO inventes funcionalidades.

NO inventes datos comerciales.

NO inventes clientes, marcas, precios, ubicaciones o inventario.

NO generes una segunda arquitectura paralela.

NO dupliques componentes existentes.

NO dupliques el Explorador.

NO dupliques la lógica de MediaKit.

NO empieces modificando código sin haber realizado primero una auditoría.

---

# 02. DOCUMENTACIÓN MAESTRA

Antes de modificar código debes localizar y leer completamente:

- DESIGN.md
- PROJECT_ARCHITECTURE.md
- documentos de continuidad existentes
- auditorías existentes
- README
- package.json
- configuración de Vite/Next.js
- configuración TypeScript
- configuración Tailwind
- archivos de routing
- estructura de componentes
- archivos relacionados con Explorador
- archivos relacionados con MediaKit
- archivos relacionados con inventario

Si existe un documento:

`PROMPT MAESTRO — CONTINUAR PROYECTO GRUPO COMUNICARTE EN OTRA CUENTA.md`

también debes leerlo.

Si existe:

`GRUPO_COMUNICARTE_DASHBOARD_HANDOFF.md`

también debes leerlo.

NO asumir que un archivo inexistente existe.

Primero localizar.

---

# 03. PRIMERA FASE — AUDITORÍA

Antes de modificar código ejecuta una auditoría estructural.

Analiza:

## Arquitectura

- framework
- entry points
- routing
- componentes
- layouts
- hooks
- servicios
- API
- backend
- database
- autenticación
- variables de entorno
- integraciones

## UI

- Design System
- tokens
- typography
- colors
- spacing
- components
- responsive
- accessibility

## Funcionalidad

- Landing
- Explorador
- búsqueda
- filtros
- resultados
- mapa
- detalle
- MediaKit
- inventario
- dashboard
- autenticación

## Calidad

- TypeScript
- ESLint
- imports
- dependencias
- errores
- warnings
- código duplicado
- código muerto
- mocks
- datos hardcoded

---

# 04. NO TOCAR TODAVÍA

Durante la primera auditoría NO modifiques:

- componentes
- rutas
- base de datos
- configuración
- dependencias

Primero entrega un diagnóstico.

El diagnóstico debe clasificar cada hallazgo como:

### CRÍTICO
Bloquea ejecución/build/producción.

### ALTO
Rompe funcionalidad o arquitectura importante.

### MEDIO
Problema de calidad o UX relevante.

### BAJO
Mejora no bloqueante.

---

# 05. EJECUTAR EL PROYECTO

Después de inspeccionar la estructura:

determina el package manager correcto a partir de:

- package.json
- lockfile

No asumir npm/pnpm/yarn/bun.

Luego instalar dependencias.

Ejecutar los scripts reales definidos en package.json.

Como mínimo intentar:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
````

Si los scripts tienen otros nombres, utilizar los existentes.

No modificar package.json solamente para ocultar errores.

---

# 06. SI EL ZIP TIENE PROBLEMAS DE DEPENDENCIAS

Diagnosticar primero.

No realizar:

```bash
rm -rf node_modules
```

como solución automática.

No cambiar package manager arbitrariamente.

No actualizar todas las dependencias indiscriminadamente.

Determinar:

* versión Node
* package manager
* lockfile
* framework
* bundler
* versiones críticas

y corregir la causa raíz.

---

# 07. OBJETIVO UX ACTUAL

La arquitectura pública objetivo es:

LANDING

├── NOSOTROS

├── SOPORTES
│   ├── LED
│   ├── TRADICIONAL
│   └── LED MÓVIL

└── SOLUCIONES

Y el flujo transversal:

EXPLORADOR
↓
BÚSQUEDA
↓
FILTROS
↓
RESULTADOS
↓
DETALLE
↓
MEDIAKIT
↓
CONFIRMACIÓN

---

# 08. NAVBAR

El navbar debe quedar:

LOGO

NOSOTROS

SOPORTES ▾

SOLUCIONES

[Solicitar MediaKit]

En desktop:

Soportes debe abrir:

LED
Tradicional
LED Móvil

En mobile:

Nosotros

Soportes
LED
Tradicional
LED Móvil

Soluciones

Solicitar MediaKit

No colocar el Explorador como una categoría editorial principal.

---

# 09. NUEVAS PÁGINAS

Debes verificar si ya existen.

No crearlas duplicadas.

Rutas objetivo:

```text
/nosotros
/soportes
/soportes/led
/soportes/tradicional
/soportes/led-movil
/soluciones
```

Si ya existen:

AUDITAR Y REUTILIZAR.

Si no existen:

IMPLEMENTAR.

---

# 10. NOSOTROS

Debe ser una página institucional orientada a confianza comercial.

Debe explicar:

* quiénes somos
* qué hacemos
* dónde operamos
* propuesta de valor
* capacidades reales
* cobertura real

No inventar información.

CTA:

Explorar soportes

CTA secundario:

Solicitar MediaKit

---

# 11. SOPORTES

IMPORTANTE:

Soportes representa tipos de soporte.

No representa el Explorador.

Debe contener:

LED

TRADICIONAL

LED MÓVIL

---

# 12. LED

Ruta:

```text
/soportes/led
```

CTA:

Explorar soportes LED

Debe abrir el Explorador existente con:

```text
tipo = LED
```

---

# 13. TRADICIONAL

Ruta:

```text
/soportes/tradicional
```

CTA:

Explorar soportes tradicionales

Debe abrir el Explorador existente con:

```text
tipo = TRADICIONAL
```

---

# 14. LED MÓVIL

Ruta:

```text
/soportes/led-movil
```

Debe enfatizar:

* movilidad
* cobertura
* desplazamiento
* activaciones
* flexibilidad

CTA:

Explorar LED Móvil

Debe abrir el Explorador existente con:

```text
tipo = LED_MÓVIL
```

---

# 15. REGLA CRÍTICA DEL EXPLORADOR

Debe existir:

UN ÚNICO EXPLORADOR.

NO crear:

Explorador LED

Explorador Tradicional

Explorador LED Móvil

Las páginas anteriores solamente deben inicializar filtros del mismo Explorador.

Ejemplo:

```text
/soportes/led
↓
Explorador
↓
tipo = LED
```

El usuario debe poder eliminar el filtro:

```text
tipo = TODOS
```

sin perder contexto.

---

# 16. PROTECCIÓN DEL EXPLORADOR

Los nuevos interiores NO deben romper:

* búsqueda
* filtros
* resultados
* mapa
* selección
* detalle
* estado
* MediaKit

El Explorador es una funcionalidad crítica.

Cualquier refactor debe preservar su comportamiento.

---

# 17. DETALLE

El detalle debe continuar siendo contextual.

Desktop:

```text
EXPLORADOR
        +
PANEL DERECHO DE DETALLE
```

NO convertirlo en:

* modal global
* fullscreen overlay
* backdrop
* página desconectada

Al cerrar:

debe volver al estado anterior.

Debe conservar:

* búsqueda
* filtros
* resultados
* selección

---

# 18. SOLUCIONES

Ruta:

```text
/soluciones
```

Debe hablar desde las necesidades comerciales del anunciante.

No inventar productos.

No crear un catálogo genérico.

Debe conectar con:

Explorador

y/o

MediaKit.

---

# 19. CARRUSEL DE MARCAS

Verificar si existe.

Si existe:

auditarlo.

Si no existe y los activos reales están disponibles:

implementarlo.

Debe:

* utilizar únicamente marcas reales
* ser responsive
* evitar overflow
* tener movimiento sutil
* respetar prefers-reduced-motion
* no competir con Hero
* no competir con Explorador

No inventar logos.

---

# 20. MEDIAKIT

Preservar el flujo existente.

Entrada global:

Navbar
↓
Solicitar MediaKit

Entrada contextual:

Explorador
↓
Detalle
↓
Solicitar MediaKit

El flujo contextual debe conservar el soporte seleccionado.

Estados:

```text
EMPTY
FILLING
VALIDATION
SENDING
SUCCESS
ERROR
RECOVERY
```

No romper backend ni integraciones existentes.

---

# 21. LANDING

No reconstruir la Landing desde cero.

Integrar la nueva arquitectura.

La estructura conceptual:

NAVBAR
↓
HERO
↓
CARRUSEL DE MARCAS
↓
PROPUESTA DE VALOR
↓
TIPOS DE SOPORTE
↓
EXPLORADOR
↓
SOLUCIONES
↓
MEDIAKIT CTA
↓
FOOTER

Adaptar al código existente.

---

# 22. DESIGN SYSTEM

Utilizar el Design System existente.

No introducir una nueva identidad visual.

No crear:

* nueva tipografía
* nuevo sistema de colores
* purple/violet arbitrario
* glassmorphism
* sombras pesadas
* estética SaaS genérica

Antes de crear un componente:

buscar si ya existe.

---

# 23. STITCH / GOOGLE STUDIO

El ZIP proviene de Google Studio.

No asumir que todo el código generado es correcto.

Auditarlo.

Clasificar:

CONSERVAR
ADAPTAR
DESCARTAR

Conservar aquello que:

* funciona
* respeta arquitectura
* respeta Design System
* mejora UX

Adaptar aquello que:

* tiene buena intención
* pero rompe arquitectura o navegación

Descartar aquello que:

* duplica lógica
* duplica componentes
* rompe Explorador
* rompe MediaKit
* genera overlays innecesarios
* crea navegación confusa
* introduce estilos arbitrarios

---

# 24. REFACTORIZACIÓN

Una vez terminada la auditoría:

refactorizar de forma incremental.

Orden:

```text
1. errores críticos
2. build
3. routing
4. componentes duplicados
5. Design System
6. Navbar
7. páginas nuevas
8. integración Explorador
9. MediaKit
10. responsive
11. accessibility
12. performance
```

No realizar un "big bang refactor".

---

# 25. BACKEND

NO modificar backend salvo necesidad real.

No cambiar arbitrariamente:

* PostgreSQL
* Neon
* Drizzle
* Firebase
* App Check
* reCAPTCHA
* OAuth
* Google Slides
* Gmail
* APIs
* autenticación

Si detectas una incompatibilidad:

documentarla antes de realizar cambios estructurales.

---

# 26. DATOS

No inventar datos.

No hardcodear nuevos:

* clientes
* marcas
* precios
* ubicaciones
* disponibilidad
* inventario

Si una información no existe:

utilizar estado vacío.

---

# 27. RESPONSIVE

Validar:

```text
1440
1280
1024
768
430
390
375
320
```

Especial atención a:

* Navbar
* Dropdown
* Carrusel
* Explorador
* filtros
* cards
* mapa
* detalle
* MediaKit

No permitir overflow horizontal.

---

# 28. MOBILE EXPLORER

Mobile debe priorizar:

RESULTADOS
↓
SELECCIÓN
↓
DETALLE

No intentar mostrar simultáneamente:

* lista
* mapa
* detalle

en una pantalla comprimida.

---

# 29. ACCESIBILIDAD

Validar:

* keyboard
* focus
* labels
* aria
* contrast
* semantic HTML
* headings
* form errors
* loading
* success
* reduced motion

---

# 30. SEO

Verificar las nuevas rutas:

```text
/nosotros
/soportes
/soportes/led
/soportes/tradicional
/soportes/led-movil
/soluciones
```

Cada página debe tener:

* title
* description
* H1
* headings semánticos
* internal links

---

# 31. QA DE NO REGRESIÓN

Probar:

```text
Landing
→ Nosotros
→ Landing
```

```text
Landing
→ Soportes
→ LED
→ Explorador
→ Detalle
→ MediaKit
→ Success
```

```text
Landing
→ Soportes
→ Tradicional
→ Explorador
```

```text
Landing
→ Soportes
→ LED Móvil
→ Explorador
```

```text
Landing
→ Soluciones
→ Explorador
```

```text
Navbar
→ MediaKit
→ Success
```

---

# 32. TEST DE CONTEXTO

Obligatorio:

```text
/soportes/led
↓
Explorador
↓
LED
↓
Resultado
↓
Detalle
↓
Cerrar
```

Confirmar que:

```text
LED
```

continúa seleccionado.

Repetir con:

* Tradicional
* LED Móvil

---

# 33. VALIDACIÓN TÉCNICA

Utilizar los scripts reales de package.json.

Como mínimo ejecutar:

```bash
npm run lint
npm run typecheck
npm run build
```

También iniciar desarrollo:

```bash
npm run dev
```

Corregir errores reales.

No ocultarlos.

No desactivar reglas para conseguir un build verde.

---

# 34. VERCEL

El proyecto debe quedar preparado para Vercel.

Verificar:

* build
* variables de entorno
* rutas
* imports
* assets
* SSR/CSR
* runtime
* APIs
* configuración

No asumir que una aplicación que funciona localmente está lista para producción.

---

# 35. REGLA DE CAMBIOS

Cada modificación debe responder:

1. ¿Qué problema resuelve?
2. ¿Por qué es necesario?
3. ¿Existe ya un componente que pueda reutilizarse?
4. ¿Rompe otra funcionalidad?
5. ¿Cómo se valida?

---

# 36. OUTPUT DE LA PRIMERA FASE

ANTES DE IMPLEMENTAR CAMBIOS IMPORTANTES entrega:

## AUDITORÍA DEL ZIP

### Arquitectura actual

### Framework

### Routing

### Componentes principales

### Design System

### Estado del Explorador

### Estado del MediaKit

### Estado del Navbar

### Estado de nuevas páginas

### Estado del carrusel de marcas

### Errores de instalación

### Errores de lint

### Errores de typecheck

### Errores de build

### Riesgos

### Recomendaciones

### PLAN DE EJECUCIÓN

No modificar masivamente hasta completar esta etapa.

---

# 37. OUTPUT FINAL

Después de completar la implementación entregar:

## ARCHIVOS MODIFICADOS

Lista exacta.

## ARCHIVOS CREADOS

Lista exacta.

## RUTAS

Lista exacta.

## COMPONENTES

Componentes nuevos/reutilizados.

## UX

Cambios realizados.

## EXPLORADOR

Confirmar no regresión.

## MEDIAKIT

Confirmar no regresión.

## RESPONSIVE

Breakpoints validados.

## ACCESSIBILITY

Validación realizada.

## TESTS

Resultados.

## LINT

Resultado.

## TYPECHECK

Resultado.

## BUILD

Resultado.

## VERCEL

Estado de preparación.

## PROBLEMAS PENDIENTES

Lista exacta.

---

# 38. PRINCIPIO FINAL

Este proyecto NO debe terminar pareciendo:

"una web generada por Google Studio".

Debe terminar pareciendo:

"Grupo Comunicarte".

Debe ser:

CLARO
COMERCIAL
PROFESIONAL
RÁPIDO
CONSISTENTE
RESPONSIVE
ACCESIBLE
MANTENIBLE
PRODUCTION-READY

---

# ORDEN ABSOLUTA

ANALIZAR

↓

AUDITAR

↓

DOCUMENTAR

↓

PLANIFICAR

↓

IMPLEMENTAR

↓

TESTEAR

↓

REFACTORIZAR

↓

VALIDAR

↓

BUILD

↓

PREPARAR PARA VERCEL

NO REINICIAR.

NO INVENTAR.

NO DUPLICAR.

NO ROMPER.

CONTINUAR.

```

**Importante:** en VS Code, la primera interacción con Gemini debería ser **solamente la auditoría**. No le pidas de entrada "implementa todo". Primero deja que conozca el ZIP y produzca el diagnóstico; después usamos el mismo documento para ejecutar la implementación por fases. Esto es especialmente importante porque el ZIP generado por Google Studio puede contener decisiones visuales correctas pero también duplicaciones o código generado que conviene refactorizar antes de seguir.
```
