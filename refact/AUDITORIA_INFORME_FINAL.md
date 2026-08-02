# GATE DE CALIDAD OBLIGATORIO (QUALITY GATE)

**Ninguna fase podrá considerarse finalizada hasta superar el siguiente proceso de validación.**

Está estrictamente prohibido avanzar a la siguiente tarea o fase si existe cualquier inconsistencia crítica, advertencia de compilación, regresión visual o incumplimiento del Design System.

## PROCESO DE VALIDACIÓN

Al finalizar cada tarea y nuevamente al finalizar cada fase, ejecuta una auditoría integral del producto.

La auditoría debe abarcar:

- Arquitectura
- UI
- UX
- Performance
- Responsive
- Accesibilidad
- Design System
- Código
- Estado global
- Integraciones
- Consistencia entre Landing y Dashboard

---

# CHECKLIST DE VALIDACIÓN

## 1. Diseño

Evaluar:

- Consistencia visual entre Landing y Dashboard
- Jerarquía tipográfica
- Espaciados
- Grid
- Radios
- Elevaciones
- Paleta cromática
- Iconografía
- Componentes reutilizados
- Estados visuales

Responder:

Estado:
❌ Error

Hallazgos:

1.  **Inconsistencia Visual Crítica**: La Landing y el Dashboard parecen productos completamente diferentes. No hay un lenguaje visual unificado, lo que degrada la confianza y la identidad de la marca.
2.  **Jerarquía Rota**: Múltiples elementos compiten por la atención del usuario, especialmente en la sección Hero, que presenta más de 12 elementos interactivos sin una prioridad clara. Esto confunde al usuario y reduce drásticamente la conversión.
3.  **Sistema Tipográfico Inexistente**: Se utilizan más de 4 familias de fuentes distintas (`Open Sans`, `Raleway`, etc.) con tamaños y pesos arbitrarios. Esto afecta negativamente la legibilidad y la coherencia de la marca.
4.  **Paleta Cromática Caótica**: Existe una proliferación de colores sin un sistema de tokens. El color primario (`#06434a`) está hardcodeado en toda la aplicación, y se mezclan más de 8 colores adicionales sin roles semánticos definidos (primario, secundario, error, etc.).
5.  **Espaciado y Grid Arbitrarios**: No se utiliza una unidad base de espaciado (ej. 4px). Los márgenes y paddings son inconsistentes entre secciones y componentes, creando un layout desorganizado y poco profesional.
6.  **Componentes No Reutilizados**: Componentes clave como `Button` y `Card` existen en el código pero son sistemáticamente ignorados. Se han detectado más de 15 variantes de tarjetas y 8 de botones implementadas con estilos ad-hoc, lo que genera una deuda técnica masiva.
7.  **Iconografía Inconsistente**: Aunque se usa `lucide-react`, hay inconsistencias en el tamaño y el peso de los íconos entre la Landing y el Dashboard.

Evidencias:

- **Auditoría UI/UX (`01_AUDITORIA_UX_UI.md`):** Documenta la fragmentación tipográfica, el caos de colores y la inconsistencia de espaciado como problemas críticos.
- **Análisis Profundo (`02_PROBLEMAS_DETECTADOS.md`):** Muestra mediciones concretas de espaciados arbitrarios (40px vs 100px), una matriz de contraste que reprueba el test WCAG y un conteo de más de 50 componentes no reutilizables.
- **Código Fuente (`LandingView.tsx`):** Se observan clases de Tailwind con valores hardcodeados (ej. `bg-[#FAF9F5]`, `text-[#06434a]`) en lugar de usar variables del tema.

Acciones correctivas:

1.  **Definir y Adoptar el Nuevo Lenguaje Visual**: Implementar la filosofía de diseño, paleta de colores, tipografía y sistemas de espaciado, radios y sombras definidos en `03_LENGUAJE_VISUAL_NUEVO.md`.
2.  **Crear y Centralizar Design Tokens**: Migrar todos los valores hardcodeados (colores, fuentes, espaciados, radios, sombras) a un archivo de configuración de Tailwind (`tailwind.config.ts`) y variables CSS, como se especifica en `05_SISTEMAS_VISUALES_TOKENS.md`.
3.  **Refactorizar Componentes para Reutilización**:
    - Unificar todos los botones de la aplicación para que usen un único componente `<Button />` con variantes (CVA).
    - Crear un `<BaseCard />` y refactorizar todas las tarjetas existentes para que sean variantes de este componente, como se detalla en `10_SISTEMA_CARDS_ARQUITECTURA.md`.
4.  **Establecer una Jerarquía Visual Clara**: Rediseñar las secciones clave (especialmente el Hero) para que tengan un único punto focal y un Call to Action (CTA) primario evidente.
5.  **Implementar un Grid Consistente**: Aplicar un sistema de grid basado en los tokens de espaciado para alinear todos los elementos de la interfaz de manera predecible.

---

## 2. UX

Validar:

- Reducción de clics
- Eliminación de fricción
- Claridad del flujo
- Descubrimiento de acciones
- Feedback visual
- Estados vacíos
- Estados de carga
- Estados de error

Responder:

Estado

Problemas encontrados

Impacto

Corrección aplicada

---

## 3. Código

Auditar:

- Componentes duplicados
- Hooks duplicados
- Utilidades repetidas
- Código muerto
- Props innecesarias
- Tipado incompleto
- Imports sin uso

Además verificar:

- SOLID
- DRY
- KISS
- Clean Architecture

Responder:

Estado

Duplicaciones detectadas

Archivos afectados

Refactor aplicado

---

## 4. Performance

Verificar:

- Renderizados innecesarios
- useEffect redundantes
- Dependencias mutables
- Re-render de listas
- Memoización
- Lazy Loading
- Suspense
- Bundle Size
- FPS de animaciones

Responder:

Estado

Problemas

Optimización aplicada

Resultado esperado

---

## 5. Responsive

Validar manualmente cada breakpoint:

320 px

375 px

390 px

414 px

768 px

1024 px

1280 px

1440 px

Comprobar:

- Grid
- Sidebar
- Dashboard
- Tablas
- Catálogo
- Mapas
- Formularios
- MediaKit

Responder:

Estado

Problemas encontrados

Capturas lógicas esperadas

Correcciones realizadas

---

## 6. Accesibilidad

Cumplimiento mínimo:

WCAG 2.2 AA

Verificar:

- Contraste
- Focus Visible
- Navegación por teclado
- Labels
- Roles ARIA
- Screen Readers
- Touch Targets
- Estados Disabled
- Estados Error

Responder:

Estado

Ratio de contraste

Problemas

Correcciones

---

## 7. Design System

Verificar que TODOS los componentes:

✔ utilicen DESIGN_SYSTEM

✔ utilicen variables CSS

✔ no posean colores hardcodeados

✔ no posean spacing hardcodeado

✔ no posean radius hardcodeado

✔ no posean sombras hardcodeadas

✔ reutilicen componentes existentes

Auditar especialmente:

- Botones
- Inputs
- Cards
- Modales
- Tablas
- Badges
- KPIs
- Sidebar
- Navbar

Responder:

Estado

Inconsistencias

Archivos afectados

Correcciones

---

## 8. Integridad Arquitectónica

Verificar:

- No existen regresiones.
- No existen dependencias circulares.
- No existen imports innecesarios.
- No existen componentes huérfanos.
- No existen estados globales inconsistentes.
- No existen hooks con responsabilidades múltiples.
- No existen violaciones del patrón Feature First.

Responder:

Estado

Hallazgos

Acciones

---

# SCORE FINAL DE LA FASE

Calcular un puntaje global.

| Área | Puntaje |
|---|---|
| Diseño | /100 |
| UX | /100 |
| Código | /100 |
| Performance | /100 |
| Responsive | /100 |
| Accesibilidad | /100 |
| Design System | /100 |
| Arquitectura | /100 |

## Promedio General

XX /100

---

# CRITERIOS DE APROBACIÓN

La fase solo podrá marcarse como COMPLETADA cuando se cumplan todas las condiciones:

✅ Sin errores TypeScript.

✅ Sin errores ESLint.

✅ Sin componentes duplicados.

✅ Sin renders innecesarios.

✅ Sin regresiones visuales.

✅ Responsive validado entre 320 px y 1440 px.

✅ Accesibilidad WCAG 2.2 AA.

✅ 100 % de los componentes utilizando DESIGN_SYSTEM.

✅ Consistencia visual entre Landing y Dashboard.

✅ Puntaje general igual o superior a 95/100.

---

# REGLA DE BLOQUEO

Si cualquiera de los siguientes casos ocurre:

- existe un error crítico,
- existe una regresión,
- el puntaje es inferior a 95/100,
- existe una inconsistencia del Design System,
- existen componentes duplicados,
- existen problemas de accesibilidad,

**la fase debe marcarse automáticamente como BLOQUEADA**, detener la ejecución y generar un plan de corrección priorizado antes de permitir avanzar.

Está estrictamente prohibido continuar con la siguiente fase hasta que todos los hallazgos críticos hayan sido resueltos.

## Hallazgos
