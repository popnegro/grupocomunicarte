# Estado de Ejecución

Versión: 1.0

Estado General:
☐ Pendiente
✅ En progreso
☐ Completado

## Hallazgos

- [x] P0-001 Implementar React Router
- [x] P0-002 Crear Design Tokens
- [x] P0-003 Unificar Button
- [x] P0-004 Unificar Card
- [x] P1-001 Inconsistencia de Terminología (UX)
- [x] P1-002 Falta de Sincronización en Tiempo Real
- [x] P1-003 Manejo de Errores y Estados de Carga
- [x] P2-001 Falta de Cliente de API Centralizado
- [x] P2-002 Datos Hardcodeados en Frontend

---

# Informe de Auditoría Integral de Producto: Landing Pública vs. Dashboard

## 1. Resumen Ejecutivo

**Pregunta Clave: ¿La Landing Pública y el Dashboard parecen formar parte del mismo producto?**

**Respuesta Corta: No.**

La auditoría revela una desconexión fundamental entre la Landing Pública y el Dashboard. Aunque comparten una base tecnológica similar (React, Vite, Tailwind), la implementación práctica diverge hasta el punto de que parecen dos aplicaciones distintas unidas por un sistema de estado compartido. La Landing es un conjunto de componentes a medida con estilos hardcodeados, mientras que el Dashboard, aunque internamente más consistente, también ignora en gran medida el sistema de diseño centralizado.

El problema principal no es la falta de intención, sino la falta de disciplina en la ejecución. Existe un Design System (`src/components/ui`), pero es sistemáticamente ignorado por ambas partes de la aplicación. Esto ha resultado en inconsistencias críticas a nivel visual, funcional y de experiencia de usuario, socavando la integridad del producto.

A pesar de las severas inconsistencias, la arquitectura subyacente es recuperable. Las acciones correctivas propuestas en este informe, si se implementan, pueden unificar el producto en un sistema cohesivo, mantenible y escalable.

---

## 2. Scores Globales

*   **Score Global de Consistencia del Producto: 45/100**
*   **Score de la Landing Pública: 35/100** (Altamente inconsistente, ignora los componentes compartidos)
*   **Score del Dashboard: 55/100** (Más consistente internamente, pero también ignora los componentes y patrones compartidos)

---

## 3. Matriz de Consistencia

| Categoría | Landing | Dashboard | Consistente | Observaciones |
|---|---|---|---|---|
| **Tipografía** | ⚠️ | ✅ | 60% | Ambas usan la fuente `sans` por defecto, pero la Landing introduce tamaños y pesos arbitrarios no estandarizados. |
| **Paleta** | ❌ | ❌ | 20% | No hay paleta de colores definida en `tailwind.config`. El color primario (`#06434a`) está hardcodeado en toda la app. |
| **Espaciado** | ⚠️ | ⚠️ | 50% | Se usan tokens de espaciado por defecto de Tailwind, pero se mezclan con valores arbitrarios, especialmente en la Landing. |
| **Botones** | ❌ | ❌ | **0%** | **Hallazgo Crítico.** El componente `ui/button.tsx` existe pero es ignorado. Se usan `<button>` nativos con estilos hardcodeados. |
| **Cards** | ⚠️ | ❌ | **20%** | **Hallazgo Crítico.** La Landing usa `ui/Card` pero lo customiza, y también usa `divs`. El Dashboard usa `divs` propios. 5+ `border-radius` distintos detectados. |
| **Iconografía** | ✅ | ✅ | 95% | Uso consistente de `lucide-react`. Los `<svg>` personalizados se usan apropiadamente para data-viz y logos. |
| **Estados** | ⚠️ | ⚠️ | 50% | El estado `loading` solo se gestiona para IA. No hay gestión de errores visible para el usuario. Inconsistente. |
| **Datos** | ✅ | ⚠️ | 60% | El flujo de datos funciona, pero no es en tiempo real y la persistencia de datos tiene riesgo de pérdida (fallback a in-memory). |
| **APIs** | ✅ | ✅ | 90% | Las APIs están bien definidas en `server.ts`. Falta un cliente de API centralizado y manejo de errores robusto. |
| **Navegación** | ⚠️ | ⚠️ | **40%** | **Hallazgo Crítico.** Utiliza un enrutamiento por hash "hackeado" en lugar de `react-router-dom`. El deep-linking es frágil y rompe expectativas del usuario. |
| **Terminología**| ⚠️ | ✅ | 65% | El Dashboard es consistente con "Cotización". La Landing y otras vistas mezclan "Cotización" con "Presupuesto", creando fricción. |

---

## 4. Resumen de Auditorías

*   **Auditoría Visual (UI):** Fallida. La ausencia de un `tailwind.config.ts` ha provocado una proliferación de valores hardcodeados para colores y radios de borde. Los componentes más importantes (Button, Card) existen en el UI kit pero no se utilizan, lo que resulta en una apariencia fragmentada.
*   **Auditoría del Design System:** Crítica. Existe un Design System en `src/components/ui` pero su adopción es cercana al 0%. Es un "Design System fantasma": está presente pero no tiene autoridad.
*   **Auditoría Funcional:** Fallida. El sistema de enrutamiento no es estándar y perjudica la usabilidad fundamental (back-button, refresh, deep-linking). La gestión de estado en un único "God Context" y la dependencia de `localStorage` son anti-patrones que impedirán el escalamiento.
*   **Auditoría de Experiencia de Usuario (UX):** Deficiente. La mezcla de terminología clave ("Cotización" vs. "Presupuesto") crea una experiencia de usuario confusa y poco profesional.
*   **Auditoría de Integraciones:** Aceptable. El flujo `Frontend -> API -> Backend` está correctamente implementado para el "happy path". Las debilidades son la falta de sincronización en tiempo real y un manejo de errores deficiente.

---

## 5. Hallazgos Priorizados por Severidad

### Crítica (P0) - Requiere Acción Inmediata

1.  **Enrutamiento No Estándar:** La falta de `react-router-dom` (o similar) rompe la funcionalidad web básica. **Impacto: Muy Alto.**
2.  **Abandono del Design System (Botones y Cards):** El código ignora los componentes `Button` y `Card` compartidos. **Impacto: Muy Alto.**
3.  **Ausencia de `tailwind.config.ts`:** La falta de tokens de diseño es la causa raíz de la inconsistencia visual. **Impacto: Muy Alto.**
4.  **Gestión de Estado con "God Context":** El uso de un único `Context` para todo el estado de la aplicación es insostenible. **Impacto: Alto.**

### Alta (P1) - Impacto Significativo en el Producto

5.  **Inconsistencia de Terminología (UX):** El uso intercambiable de "Cotización" y "Presupuesto" confunde al usuario. **Impacto: Medio.**
6.  **Falta de Sincronización en Tiempo Real:** Los datos no se actualizan entre clientes sin recargar la página. **Impacto: Medio.**
7.  **Manejo de Errores y Estados de Carga:** La UI no comunica fallos de API o estados de carga de manera consistente. **Impacto: Medio.**

### Media (P2) - Mejoras Recomendadas

8.  **Falta de Cliente de API Centralizado:** Dificulta la gestión de headers, auth y errores. **Impacto: Bajo.**
9.  **Datos Hardcodeados en Frontend:** El `CmsContext` contiene datos semilla que deberían venir de la API. **Impacto: Bajo.**

---

## 6. Propuesta de un Design System Unificado

El Design System no debe ser reinventado, sino **reforzado**.

1.  **Establecer `tailwind.config.ts` como ÚNICA fuente de verdad** para tokens de diseño.
    *   Definir la paleta de colores: `primary: '#06434a'`, `secondary`, `accent`, etc.
    *   Definir la escala de `borderRadius` y `spacing` para eliminar valores arbitrarios.
2.  **Reforzar `src/components/ui` como la Librería de Componentes Central.**
    *   Auditar y enriquecer los componentes existentes (`Button`, `Card`) con las `variants` necesarias para cubrir los diseños de la Landing y el Dashboard. Por ejemplo, el botón de la landing puede ser una variante `hero` o un tamaño `xl`.
    *   Deprecar componentes duplicados como `BaseCard.tsx` en favor de un único `Card.tsx` con variantes.
3.  **Crear un Storybook o similar** para documentar los componentes, sus variantes y su uso correcto. Esto sirve como guía para los desarrolladores y asegura la consistencia futura.

---

## 7. Roadmap de Implementación por Sprints

### Sprint 0: Fundación (1-2 semanas) - Bloqueo Técnico

*   **Tarea 1 (P0):** Implementar `react-router-dom`. Refactorizar la navegación de `activeView` a rutas URL (`/`, `/dashboard`, `/dashboard/clientes`, etc.).
*   **Tarea 2 (P0):** Crear y popular `tailwind.config.ts` con todos los tokens de diseño (colores, radius, fuentes).
*   **Tarea 3 (P1):** Implementar `react-query` (o SWR) para gestionar el estado del servidor. Refactorizar `fetchLeads` y `addLead` para usar `useQuery` y `useMutation`. Esto solucionará automáticamente muchos problemas de estado de carga/error.

### Sprint 1: Unificación Visual (2 semanas)

*   **Tarea 4 (P0):** Refactorizar TODOS los `<button>` nativos para que usen el componente `<Button />` de `src/components/ui` con las variantes correctas.
*   **Tarea 5 (P0):** Unificar `Card.tsx` y `BaseCard.tsx`. Refactorizar TODOS los `divs` que actúan como tarjetas para que usen el componente `<Card />` unificado.
*   **Tarea 6 (P1):** Reemplazar todos los valores hardcodeados de colores y radios por los nuevos tokens de Tailwind.

### Sprint 2: Pulido de UX y Datos (1 semana)

*   **Tarea 7 (P1):** Estandarizar la terminología. Reemplazar "Presupuesto" por "Cotización" en todos los flujos de usuario.
*   **Tarea 8 (P2):** Mover datos semilla (`SEED_SCREENS`, etc.) del frontend al backend y servirlos vía API.
*   **Tarea 9 (P2):** Implementar una solución básica de tiempo real (ej. polling con `react-query`) para la lista de leads.

---

## 8. Checklist Final

*   **¿La Landing y el Dashboard parecen un único producto?**
    *   ❌ **No.**
*   **¿Existe un lenguaje visual consistente?**
    *   ❌ **No.** La falta de tokens y el abandono de componentes compartidos lo impiden.
*   **¿Las integraciones están correctamente conectadas?**
    *   ✅ **Sí.** El flujo de datos básico funciona, pero carece de robustez.
*   **¿Los datos permanecen sincronizados en todos los flujos?**
    *   ⚠️ **Parcialmente.** La sincronización no es en tiempo real.
*   **¿Qué debe corregirse antes de considerar el producto listo para producción?**
    *   **Todos los hallazgos de severidad Crítica (P0) son bloqueantes.** El enrutamiento, el sistema de diseño y la gestión de estado deben ser refactorizados por completo antes de que el producto pueda considerarse profesional, mantenible o escalable.
