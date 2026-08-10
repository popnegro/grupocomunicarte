# FASE 11C — Descubrimiento y Hardening del circuito comercial

## Baseline

- Base: FASE 11B.4.7 validada.
- Rama objetivo: `feat/fase-02-ubicaciones-destacadas`.
- Diseño Stitch y flujo funcional existente: preservados.
- Datos, IDs y contratos existentes: preservados.

## 11C.1 — Disponibilidad

### Hallazgos

1. `src/utils/availability.ts` centraliza `getScreenAvailability()` e `isScreenAvailableForWeeks()`.
2. La disponibilidad comercial exige que el estado explícito no sea `reserved`, `no disponible`, `pausado` o `upcoming` y que todas las semanas solicitadas estén en estado `available` cuando existe una matriz.
3. Cuando no existe una entrada para un soporte en `occupancyMatrix`, el sistema conserva deliberadamente el fallback público y lo considera disponible.
4. `getDynamicReservationEndDate()` contiene fechas de referencia de agosto de 2026. No se modifica en esta etapa porque la matriz no contiene fechas por semana y cambiar el calendario requeriría una decisión de contrato de negocio.

### Decisión

No alterar todavía el fallback de datos faltantes ni inventar un calendario de ocupación. Queda como punto explícito para definir antes de endurecer la disponibilidad comercial.

## 11C.2 — Cart Store

### Hallazgo

`isScreenAvailableForWeeks()` limita la duración comercial a 1–8 semanas, mientras el store podía aceptar cualquier número y persistirlo. Eso podía producir una divergencia entre el cálculo comercial y la selección del usuario.

### Cambio aplicado

`src/stores/cartStore.ts` ahora:

- normaliza semanas a entero;
- limita el rango a 1–8;
- trata valores no finitos como 1;
- normaliza también el estado persistido al hidratar Zustand;
- mantiene la migración legacy existente;
- mantiene `clearCart()` en 1 semana.

### No cambiado

- IDs de soportes.
- estructura del carrito.
- nombre de storage.
- UX.
- diseño Stitch.
- lógica de disponibilidad.
