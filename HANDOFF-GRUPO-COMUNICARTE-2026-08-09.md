# HANDOFF — Grupo Comunicarte
## Continuación de proyecto / sesión

**Fecha:** 2026-08-09  
**Proyecto:** Grupo Comunicarte  
**Tipo:** Plataforma SaaS / DOOH + landing pública  
**Stack principal:** React + TypeScript + Vite + Tailwind CSS + Supabase/Firebase según módulo + Vercel  
**Estado:** PMV en fase de consolidación UX/UI + corrección técnica  
**Próximo movimiento:** ejecutar **11C.8 en código** mientras se ejecuta **D1 Discovery en Stitch** usando el nuevo `DESIGN.md`.

---

# 1. OBJETIVO DE ESTE HANDOFF

Continuar el desarrollo del proyecto **Grupo Comunicarte** desde otra cuenta sin volver a realizar el análisis conceptual desde cero.

La prioridad actual NO es agregar funcionalidades indiscriminadamente.

El objetivo es:

1. Consolidar el PMV.
2. Ejecutar la tarea **11C.8** sobre el código existente.
3. Mantener estabilidad técnica.
4. Utilizar el nuevo `DESIGN.md` como fuente de verdad visual/UX.
5. Ejecutar **D1 Discovery en Stitch**.
6. Comparar el resultado de Stitch con el PMV real.
7. Recién después decidir qué elementos pasan a una siguiente fase de diseño/implementación.

---

# 2. PRINCIPIO DE TRABAJO

## Regla principal

> **No seguir diseñando en abstracto.**

El proyecto ya tiene suficiente definición conceptual.

La siguiente etapa debe ser de:

**implementación → validación → comparación → ajuste.**

Evitar:

- agregar features por iniciativa propia;
- cambiar arquitectura sin necesidad;
- rehacer componentes que funcionan;
- introducir nuevas dependencias innecesarias;
- modificar el alcance del PMV;
- convertir Stitch en una herramienta para inventar funcionalidades.

---

# 3. PRÓXIMO MOVIMIENTO CONCRETO

## Track A — Código

Ejecutar:

### `11C.8`

Debe implementarse directamente sobre el proyecto actual.

Después:

1. revisar TypeScript;
2. revisar imports;
3. revisar estados;
4. revisar routing;
5. revisar componentes afectados;
6. revisar posibles regresiones;
7. ejecutar build;
8. corregir errores;
9. confirmar que el PMV continúa funcionando.

### Restricción

No implementar funcionalidades que no estén explícitamente relacionadas con 11C.8.

---

# 4. Track B — Stitch

Mientras se implementa 11C.8:

## Ejecutar `D1 Discovery`

Usar como fuente de dirección:

```text
DESIGN.md
```

El `DESIGN.md` actualizado debe ser considerado la fuente de verdad para:

- sistema visual;
- lenguaje UI;
- jerarquía;
- layout;
- navegación;
- componentes;
- espaciado;
- tipografía;
- estados;
- responsive;
- principios UX.

D1 Discovery debe utilizarse para **validar dirección**, no para ampliar arbitrariamente el producto.

---

# 5. OBJETIVO DE D1 DISCOVERY

La evaluación de Stitch debe concentrarse en:

## UX

- claridad de navegación;
- jerarquía de información;
- comprensión inmediata del producto;
- reducción de fricción;
- cantidad de decisiones visibles;
- consistencia entre pantallas;
- claridad de CTA;
- estados vacíos;
- loading;
- error;
- éxito;
- feedback de acciones.

## UI

- jerarquía tipográfica;
- densidad visual;
- spacing;
- cards;
- tablas;
- formularios;
- botones;
- badges;
- navegación;
- iconografía;
- contraste;
- responsive;
- consistencia de componentes.

## Producto

Validar que la interfaz siga siendo coherente con el PMV.

No evaluar solamente:

> "¿Se ve moderno?"

Evaluar:

> "¿Ayuda al usuario a completar las tareas principales del PMV con la menor fricción posible?"

---

# 6. CONTEXTO DEL PROYECTO

Grupo Comunicarte es una plataforma orientada a servicios/productos de comunicación visual y DOOH.

El proyecto contempla una separación conceptual entre:

### Landing pública

Objetivo:

- explicar propuesta de valor;
- mostrar oferta;
- generar confianza;
- facilitar conversión;
- permitir explorar soluciones;
- conducir hacia contacto/acción.

### Aplicación / dashboard

Objetivo:

- administrar recursos;
- gestionar inventario/soportes;
- gestionar cotizaciones;
- trabajar con campañas/servicios;
- facilitar operaciones;
- centralizar información.

La interfaz debe sentirse como un producto profesional, no como una colección de pantallas independientes.

---

# 7. DIRECCIÓN UX/UI

La dirección buscada es:

- profesional;
- SaaS;
- moderna;
- clara;
- sobria;
- orientada a productividad;
- alta legibilidad;
- buena jerarquía;
- baja fricción;
- consistente.

Referencias conceptuales utilizadas previamente:

- Vercel;
- Linear;
- dashboards SaaS modernos;
- sistemas basados en componentes;
- layouts limpios;
- navegación clara;
- densidad controlada.

No copiar visualmente estas referencias.

Usarlas solamente como referencia de calidad de producto.

---

# 8. SISTEMA VISUAL

El proyecto debe tender hacia un sistema visual coherente y reutilizable.

### Tipografía

Se había planteado:

**Plus Jakarta Sans**

como tipografía principal.

### Iconografía

Preferencia:

**Lucide React**

Evitar mezclar familias de iconos sin una razón clara.

### CSS

Preferencia:

**Tailwind CSS**

Evitar estilos inline innecesarios y CSS duplicado.

### Componentización

Priorizar componentes reutilizables para:

- botones;
- cards;
- inputs;
- badges;
- tablas;
- modales;
- navegación;
- estados;
- feedback;
- layouts;
- formularios.

---

# 9. ARQUITECTURA TÉCNICA

Stack utilizado/relevante:

```text
React
TypeScript
Vite
Tailwind CSS
Lucide React
Vercel
Supabase
Firebase / Google Auth según módulo
Mercado Pago
Google Cloud
```

No asumir que todos estos servicios participan en todos los módulos.

Antes de modificar integraciones:

1. revisar implementación existente;
2. identificar fuente real de datos;
3. mantener contratos existentes;
4. evitar migraciones innecesarias.

---

# 10. REGLAS PARA MODIFICAR EL CÓDIGO

Antes de modificar un archivo:

1. leer el componente completo;
2. entender sus props;
3. identificar hooks utilizados;
4. revisar imports;
5. revisar dependencias;
6. revisar quién lo consume;
7. revisar tipos asociados.

No hacer cambios aislados que puedan romper:

- routing;
- contextos;
- stores;
- cart;
- autenticación;
- APIs;
- componentes compartidos.

---

# 11. ERRORES RECIENTES / HISTÓRICOS IMPORTANTES

El proyecto ha tenido varios problemas de TypeScript/React/Vite.

Entre ellos:

### Imports inexistentes

Ejemplos históricos:

```text
Cannot find module '../SoportesInventory'
Cannot find module '../types'
Cannot find module './components/ui/card'
```

### Exportaciones incorrectas

Ejemplo:

```text
Module './components/ErrorBoundary' has no exported member 'ErrorBoundary'
```

cuando el componente era default export.

### Variables inexistentes

Ejemplo:

```text
Cannot find name 'clearCart'
```

### Problemas de React/runtime

También apareció un error relacionado con incompatibilidad/runtime:

```text
Cannot set properties of undefined
(setting 'unstable_now')
```

No asumir que estos errores continúan presentes.

Primero comprobar el estado actual.

---

# 12. PROBLEMAS QUE YA SE HAN TRABAJADO

Se trabajó previamente sobre:

- routing;
- React Router;
- HashRouter vs BrowserRouter;
- Vercel;
- `vercel.json`;
- Firebase/Google Auth;
- errores TypeScript;
- errores JSX;
- ErrorBoundary;
- lazy loading;
- Suspense;
- ScrollRestoration;
- SEO;
- favicon;
- manifest;
- PWA;
- Open Graph;
- `/api/leads`;
- errores HTTP 500;
- Leaflet;
- componentes de inventario;
- cotizaciones;
- carrito;
- UX/UI;
- performance.

No repetir estas auditorías completas salvo que el estado actual del código lo requiera.

---

# 13. PERFORMANCE

La aplicación debe mantener especial atención sobre:

- bundle size;
- carga inicial;
- JavaScript innecesario;
- componentes pesados;
- imágenes;
- lazy loading;
- code splitting;
- llamadas innecesarias;
- renders innecesarios.

Se había recomendado:

```text
React.lazy
Suspense
code splitting
```

pero solamente donde aporten valor real.

No convertir todo en lazy-loaded por defecto.

---

# 14. LANDING PÚBLICA

La landing debe priorizar:

1. propuesta de valor;
2. comprensión;
3. confianza;
4. diferenciación;
5. servicios/productos;
6. prueba social;
7. CTA;
8. contacto.

SEO debe contemplar:

- títulos;
- metadescripciones;
- URLs limpias;
- estructura semántica;
- Open Graph;
- sitemap;
- robots;
- datos estructurados cuando corresponda.

GEO también forma parte de la estrategia:

- contenido estructurado;
- respuestas claras;
- entidades;
- información contextual;
- FAQs;
- señales semánticas.

---

# 15. DASHBOARD

El dashboard debe priorizar:

## Información

Mostrar primero lo que permite tomar decisiones.

## Acciones

Las acciones principales deben ser evidentes.

## Navegación

Evitar:

- menús excesivamente profundos;
- demasiadas opciones simultáneas;
- duplicación de funciones.

## Estados

Toda funcionalidad importante debería contemplar:

```text
loading
empty
success
error
disabled
```

cuando corresponda.

---

# 16. FILOSOFÍA DEL PMV

El PMV debe ser:

> **pequeño, usable y demostrable.**

No necesita resolver todos los casos posibles.

Debe permitir demostrar claramente:

- qué problema resuelve;
- para quién;
- cómo funciona;
- cuál es el flujo principal;
- qué valor genera.

Evitar convertirlo en un ERP/CRM completo antes de validar el núcleo.

---

# 17. CRITERIO PARA AGREGAR FEATURES

Antes de agregar una feature preguntar:

### ¿Es necesaria para el flujo principal?

Si no:

→ postergar.

### ¿Es necesaria para demostrar valor comercial?

Si no:

→ postergar.

### ¿Es necesaria para evitar un bloqueo técnico?

Si no:

→ postergar.

### ¿Es solamente "nice to have"?

→ NO implementar en esta fase.

---

# 18. STITCH — CRITERIO DE EVALUACIÓN

Cuando Stitch produzca propuestas, no aceptarlas automáticamente.

Evaluarlas con esta matriz:

| Criterio | Pregunta |
|---|---|
| Claridad | ¿Se entiende rápidamente? |
| Jerarquía | ¿Qué es lo más importante? |
| Conversión | ¿La acción principal es evidente? |
| Productividad | ¿Reduce pasos? |
| Consistencia | ¿Respeta el sistema? |
| Escalabilidad | ¿El patrón puede reutilizarse? |
| Responsive | ¿Funciona en diferentes tamaños? |
| Accesibilidad | ¿Es legible y operable? |
| PMV | ¿Aporta al producto actual? |

---

# 19. D1 → D2

No pasar automáticamente de D1 a D2.

Primero:

```text
D1 Discovery
    ↓
Evaluación
    ↓
Comparación con PMV
    ↓
Decisiones
    ↓
D2
```

D2 solamente debe comenzar cuando exista claridad sobre:

- qué pantallas se mantienen;
- qué patrones se reutilizan;
- qué problemas de UX deben corregirse;
- qué componentes se convierten en sistema;
- qué elementos son descartados.

---

# 20. FUENTE DE VERDAD

En caso de conflicto:

### Producto real

```text
Código actual
```

define comportamiento existente.

### Diseño

```text
DESIGN.md
```

define la dirección visual/UX.

### PMV

define el alcance.

### Stitch

sirve para explorar/validar diseño.

Stitch **no debe convertirse en fuente automática de alcance funcional**.

---

# 21. PROCESO RECOMENDADO PARA LA NUEVA CUENTA

Al iniciar la nueva sesión:

### Paso 1

Leer este documento completo.

### Paso 2

Solicitar/abrir:

```text
DESIGN.md
```

### Paso 3

Solicitar el estado actual de:

```text
11C.8
```

### Paso 4

Revisar estructura del proyecto.

### Paso 5

Ejecutar 11C.8.

### Paso 6

Ejecutar:

```text
npm run build
```

o el comando equivalente definido en `package.json`.

### Paso 7

Corregir errores derivados.

### Paso 8

Ejecutar D1 Discovery en Stitch usando `DESIGN.md`.

### Paso 9

Comparar Stitch vs implementación.

### Paso 10

Generar una lista de decisiones:

```text
KEEP
CHANGE
REMOVE
DEFER
```

### Paso 11

Definir D2 únicamente después de esa comparación.

---

# 22. FORMATO DE REPORTE DESPUÉS DE 11C.8

Al terminar 11C.8, reportar:

```text
## 11C.8 — Resultado

STATUS:
PASS / PARTIAL / BLOCKED

FILES MODIFIED:
- ...

FILES CREATED:
- ...

FILES REMOVED:
- ...

FUNCTIONAL CHANGES:
- ...

TECHNICAL CHANGES:
- ...

TYPECHECK:
PASS / FAIL

BUILD:
PASS / FAIL

REGRESSIONS:
- ...

FOLLOW-UP:
- ...
```

No afirmar PASS si el build no fue comprobado.

---

# 23. FORMATO DE EVALUACIÓN DE STITCH

Después de D1:

```text
## D1 Discovery — Resultado

DIRECTION:
KEEP / REVISE / REJECT

UX:
- ...

UI:
- ...

NAVIGATION:
- ...

COMPONENT SYSTEM:
- ...

RESPONSIVE:
- ...

ACCESSIBILITY:
- ...

PMV ALIGNMENT:
- ...

KEEP:
- ...

CHANGE:
- ...

REMOVE:
- ...

DEFER:
- ...

RECOMMENDATION FOR D2:
- ...
```

---

# 24. REGLA IMPORTANTE PARA LA IA QUE CONTINÚE

No comenzar diciendo:

> "Podemos hacer una auditoría completa..."

No reiniciar el proyecto.

No volver a proponer toda la arquitectura.

No generar una lista enorme de features.

La tarea inmediata es concreta:

> **Ejecutar 11C.8 en el código y, en paralelo, ejecutar D1 Discovery en Stitch con el nuevo `DESIGN.md`.**

---

# 25. COMANDO DE CONTINUIDAD

La nueva cuenta debe interpretar este texto como contexto de trabajo y comenzar desde:

```text
11C.8 → implementación
+
D1 Discovery → Stitch
```

El primer objetivo técnico es dejar el código en estado:

```text
TypeScript OK
Build OK
PMV estable
```

El primer objetivo de diseño es dejar D1 en estado:

```text
Dirección UX/UI validada
Patrones identificados
Cambios priorizados
D2 preparado
```

---

# 26. ESTADO ESPERADO AL FINAL DE ESTA FASE

Al finalizar esta etapa deberíamos tener:

### Código

- 11C.8 implementado;
- build funcionando;
- sin errores TypeScript críticos;
- sin regresiones evidentes;
- PMV estable.

### Diseño

- D1 Discovery completado;
- `DESIGN.md` validado;
- sistema visual más definido;
- problemas UX identificados;
- patrones reutilizables definidos;
- decisiones KEEP / CHANGE / REMOVE / DEFER.

### Siguiente etapa

Solo entonces:

```text
D2
```

con alcance definido a partir de evidencia.

---

# 27. RESUMEN EJECUTIVO

```text
PROYECTO
Grupo Comunicarte

FASE
Consolidación PMV + UX/UI

AHORA
11C.8 en código

EN PARALELO
D1 Discovery en Stitch

FUENTE DE DISEÑO
DESIGN.md

OBJETIVO TÉCNICO
Build estable + TypeScript limpio

OBJETIVO UX
Validar dirección y patrones

NO HACER
Agregar features arbitrarias

NO HACER
Rediseñar todo desde cero

NO HACER
Pasar directamente a D2

SIGUIENTE DECISIÓN
KEEP / CHANGE / REMOVE / DEFER

DESPUÉS
D2
```

---

## INSTRUCCIÓN FINAL PARA LA NUEVA SESIÓN

**Continuá desde este handoff. No reinicies el análisis del proyecto.**

Primero revisá el estado actual de `11C.8` y del código relacionado. Luego ejecutá la implementación de 11C.8 con el mínimo cambio necesario y verificá TypeScript + build.

En paralelo, utilizá el `DESIGN.md` actualizado para ejecutar **D1 Discovery en Stitch**.

Al finalizar ambos tracks, compará resultados y entregá una matriz **KEEP / CHANGE / REMOVE / DEFER**. No avances a D2 hasta que esa matriz esté definida.