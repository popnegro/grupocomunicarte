# FASE 07.6 — QA final de Stitch

## Alcance
Auditoría de Desktop/Mobile y flujo funcional sobre la base de Fase 07.5.

## Hallazgos corregidos

1. **Disponibilidad en Explorador y Ubicaciones Destacadas**
   - Antes: ambos componentes consultaban `getScreenAvailability(screen, {})`.
   - Corrección: ahora consumen `occupancyMatrix` desde `useCms()`.
   - Resultado: Reservado/Campaña/Mantenimiento ya no puede aparecer como disponible por ignorar la matriz.

2. **Ubicaciones Destacadas por ciudad**
   - Antes: tomaba los primeros cuatro soportes disponibles de todas las ciudades.
   - Corrección: filtra primero por `selectedCity`.
   - Resultado: la sección permanece coherente con la ciudad activa.

3. **“Ubicar en el mapa”**
   - Antes: cambiaba la ciudad y hacía scroll al explorador, pero no señalaba el soporte.
   - Corrección: se añade `focusScreenId` al explorador y se utiliza el `selectedScreenId` real de `InteractiveMap`.
   - Resultado: al usar “Ubicar en el mapa”, el mapa puede centrar/resaltar el soporte solicitado sin crear un flujo paralelo.

## Validaciones ejecutadas

- Parse/transpilación TypeScript de los tres componentes modificados: OK.
- Búsqueda de estado de carrito duplicado: `useCartStore` es la fuente única; `smartweb_dooh_cart` permanece únicamente para migración/reset.
- `npm ci --ignore-scripts`: NO completó porque el registry del entorno devuelve 404 para `zustand@5.0.14`.
- Build completo: NO certificado en este entorno por la dependencia anterior.

## No se modificó

- `cartStore` como fuente de verdad.
- `/api/leads`.
- lógica de backend.
- disponibilidad comercial del Media Kit.
- navegación principal.
- estructura de solicitud comercial.

## Criterios funcionales

Explorador → Detalle → Agregar al Media Kit → cart: preservado.

Ubicaciones Destacadas → Detalle/Seleccionar → cart: preservado.

Ubicar en mapa → Explorador → foco en soporte: corregido.

Media Kit vacío/con soportes → solicitud: preservado.

Desktop/Mobile: los cambios de esta fase son responsive/QA y no introducen estados paralelos.
