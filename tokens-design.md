# Design Tokens — Grupo Comunicarte PMV

> **Estado:** Baseline visual operativo del PMV Demo  
> **Referencia visual:** `experiment/pmv-inventory-explorer`  
> **Objetivo:** consolidar un lenguaje visual único para Landing, Inventario, Login, Dashboard y Media Kit.

## 1. Principios

1. Claridad primero: la interfaz debe comunicar rápidamente qué es cada elemento y cuál es la acción principal.
2. Consistencia: un mismo patrón visual debe comportarse igual en Landing y Dashboard.
3. Jerarquía: títulos, datos principales, estados y CTA deben tener prioridad visual inequívoca.
4. Simplicidad PMV: no agregar capas visuales innecesarias.
5. Responsive by default: cada componente debe funcionar en desktop y mobile.
6. Estados completos: loading, empty, error, selected y disabled forman parte del diseño.
7. Accesibilidad: contraste suficiente, foco visible, labels claros y targets táctiles razonables.

## 2. Golden UI / UX

La referencia visual principal es:

```text
experiment/pmv-inventory-explorer
```

Debe utilizarse como **Golden UI/UX Reference** para evaluar desviaciones de `main`.

La referencia define el lenguaje visual y UX; no obliga a copiar implementaciones técnicas antiguas cuando una implementación más simple y estable conserva el resultado visual y funcional del PMV.

## 3. Color

### Brand

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#06434A` | marca, headings destacados, acciones principales |
| `--color-secondary` | `#07BE8A` | accent, éxito, elementos destacados |
| `--color-primary-hover` | `#0B5E67` | hover/active primario |
| `--color-background` | `#FAF9F5` | fondo principal cálido |
| `--color-white` | `#FFFFFF` | cards, inputs y superficies |

### Neutrales

Usar una única escala neutral semántica. Las clases `stone-*` existentes solo deben utilizarse cuando correspondan al token equivalente; no crear una segunda paleta sin necesidad.

| Token | Uso |
|---|---|
| `--color-neutral-50` | fondos sutiles |
| `--color-neutral-100` | superficies secundarias |
| `--color-neutral-200` | borders/dividers |
| `--color-neutral-300` | borders activos |
| `--color-neutral-500` | texto secundario |
| `--color-neutral-700` | texto principal secundario |
| `--color-neutral-900` | headings/texto principal |

### Estados

`success`, `warning`, `error` e `info` deben ser semánticos y no depender únicamente del color.

## 4. Tipografía

```text
Display / headings: Poppins
Body / UI: Inter
```

Jerarquía operativa:

| Token | Uso |
|---|---|
| `display-xl` | Hero principal |
| `display-lg` | títulos principales de sección |
| `heading-xl` | títulos de página |
| `heading-lg` | títulos de bloques |
| `heading-md` | cards/subsecciones |
| `body-lg` | introducciones |
| `body-md` | contenido principal |
| `body-sm` | metadata |
| `caption` | información auxiliar |

Reglas: H1 único cuando sea semánticamente apropiado, priorizar legibilidad, limitar ancho de lectura y usar una escala más compacta en Dashboard.

## 5. Spacing

Base: **4px**.

| Token | Valor |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |

Preferir la escala antes que valores arbitrarios.

## 6. Layout

- Containers centrados y consistentes.
- Landing puede utilizar mayor ancho para composición.
- Dashboard prioriza densidad y productividad.
- Inventario usa cards adaptativas.
- Media Kit usa selección + resumen/preview.

## 7. Radius

| Token | Uso |
|---|---|
| `radius-sm` | inputs pequeños, badges |
| `radius-md` | inputs, botones secundarios |
| `radius-lg` | cards |
| `radius-xl` | bloques destacados / hero |
| `radius-full` | pills, avatars, controles circulares |

No mezclar radios arbitrariamente dentro de una familia de componentes.

## 8. Borders y sombras

Borders:

```text
border-subtle
border-default
border-strong
```

Sombras:

```text
shadow-none
shadow-subtle
shadow-card
shadow-elevated
```

Cards normales deben usar sombra mínima o ninguna; elementos flotantes y modales pueden usar mayor elevación.

## 9. Buttons

Variantes obligatorias:

- Primary: CTA principal, guardar, generar Media Kit.
- Secondary: acciones alternativas.
- Ghost: acciones de bajo peso visual.
- Destructive: exclusivamente acciones destructivas.

Todos deben contemplar hover, focus, loading y disabled.

## 10. Forms

Estados mínimos:

```text
default / hover / focus / filled / disabled / error / success
```

Los inputs deben tener labels claros y mensajes de error próximos al campo. No depender del placeholder como label.

## 11. Cards e inventario

Estructura recomendada:

```text
IMAGE
Tipo / estado
Nombre
Ubicación
Metadata
CTA
```

Reglas: imagen consistente, título dominante, metadata secundaria, disponibilidad inequívoca y CTA consistente.

Estados de soporte:

```text
Disponible
Reservado
No disponible
Disponible desde [fecha]
```

Para reservados: estado + `availableFrom` + CTA `Consultar disponibilidad`.

## 12. Soportes destacados

`isFeatured` debe producir una jerarquía visual premium sin romper la consistencia del inventario. La sección `Soportes destacados` debe integrarse naturalmente en Landing.

## 13. Navigation

Landing:

```text
Logo → navegación → CTA principal
```

Dashboard:

```text
Marca → navegación contextual → usuario/sesión
```

La página activa debe ser evidente.

## 14. Dashboard

Prioridad:

```text
Page title
↓
Primary action
↓
KPIs / summary
↓
Data
↓
Secondary actions
```

Evitar decoración excesiva, cards innecesarias y colores sin función.

## 15. Media Kit

Debe sentirse como producto, no como formulario administrativo.

```text
Seleccionar soportes
↓
Configurar
↓
Resumen
↓
Generar Media Kit
↓
Preview
↓
Descargar / compartir
```

`Generar Media Kit` es la acción dominante y el preview debe conservar la identidad de Grupo Comunicarte.

## 16. Responsive QA

Breakpoints deben respetar el sistema existente. Mínimos de validación:

```text
1440 × 900
1280 × 800
1024 × 768
390 × 844
375 × 812
```

Obligatorio: sin overflow horizontal, navegación usable, cards adaptativas, imágenes correctas, CTA accesibles, Dashboard operativo y Media Kit operativo.

## 17. Accessibility baseline

- Contraste suficiente.
- Foco visible.
- Labels de formularios.
- Alt text en imágenes relevantes.
- Botones identificables.
- Navegación por teclado razonable.
- No depender únicamente del color.
- Targets táctiles razonables.

## 18. Visual QA severity

### BLOCKER

Layout roto, navegación inutilizable, contenido superpuesto, CTA inaccesible, contraste ilegible, Dashboard inutilizable o Media Kit inutilizable.

### MAJOR

Desviación clara del Golden UI, jerarquía visual incorrecta, componente principal inconsistente o responsive roto en una superficie importante.

### MINOR

Spacing, alineación, detalles tipográficos o diferencias cosméticas menores.

## 19. PMV UI/UX Gate

```text
BLOCKER = 0
MAJOR   = 0
MINOR   <= 5
```

Y obligatoriamente:

```text
Landing       PASS
Inventario    PASS
Login         PASS
Dashboard     PASS
Media Kit     PASS
Desktop       PASS
Mobile        PASS
Design System PASS
```

## 20. Regla de implementación

Antes de crear un estilo nuevo:

1. Buscar si ya existe un token.
2. Buscar si ya existe un componente.
3. Reutilizar el patrón.
4. Crear una variante solo cuando exista una necesidad funcional o UX real.

Evitar nuevos colores, radios, escalas tipográficas, cards o botones equivalentes sin justificación.

## 21. Regla de cierre del PMV

> **Funcional antes que perfecto.**

El PMV no necesita pixel-perfect ni arquitectura definitiva. Sí necesita funcionalidad real, coherencia visual, UX usable, responsive y persistencia en el flujo crítico.

El rediseño completo forma parte del PMV Demo, pero no debe convertirse en sobreingeniería.

## 22. Definition of Done

```text
LANDING
  ✓ rediseñada
  ✓ responsive
  ✓ navegación funcional

INVENTARIO
  ✓ completo
  ✓ filtros
  ✓ disponibilidad
  ✓ estados
  ✓ responsive

LOGIN
  ✓ funcional
  ✓ estados
  ✓ responsive

DASHBOARD
  ✓ autenticado
  ✓ inventario
  ✓ CRUD mínimo
  ✓ responsive

MEDIA KIT
  ✓ selección
  ✓ generación
  ✓ preview
  ✓ salida/descarga

DESIGN
  ✓ Golden UI respetada
  ✓ tokens coherentes
  ✓ componentes consistentes

QA
  ✓ Desktop
  ✓ Mobile
  ✓ UI/UX
  ✓ P0/P1 resueltos

→ PMV DEMO READY
```
