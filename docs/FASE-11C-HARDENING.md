# FASE 11C — Hardening comercial

## 11C.3 — Media Kit / cálculo

Auditoría del baseline 11B.4.7 + cart hardening:

- La disponibilidad se calcula mediante `isScreenAvailableForWeeks`.
- Los soportes no encontrados en `screens` quedan fuera de `selectedScreens` y se registran como bloqueo comercial.
- Los soportes no disponibles quedan fuera de `selectedAvailable` y bloquean el envío.
- `totalWeekly` suma únicamente soportes disponibles.
- `estimatedTotal` multiplica el subtotal semanal por las semanas normalizadas del carrito.
- Los precios `<= 0` siguen representando `CONSULTAR` según `formatPrice`; no se introduce una nueva regla de negocio.
- Un soporte con precio `0` actualmente puede formar parte del payload con `value: 0`; esto se conserva porque el contrato de `Lead.value` es numérico y no existe una decisión validada para representar una cotización no tarifada como otro estado.

## 11C.4/11C.5 — Lead API y persistencia

Se detectó un problema de consistencia: `CmsContext.addLead` guardaba primero directamente en Firestore y luego llamaba a `/api/leads`, mientras que el servidor ya persiste en PostgreSQL y sincroniza Firestore. Esto podía duplicar leads y, además, el fallback local podía presentar un envío como exitoso aunque la API hubiera fallado.

Corrección aplicada:

- `/api/leads` pasa a ser la ruta de escritura autoritativa.
- Se elimina la escritura directa de Firestore desde el cliente.
- Si la API responde correctamente, el lead se incorpora al estado local.
- Si la API falla, `addLead` lanza un error para que la UI pueda mostrar el estado de error real.
- No se modifica el contrato visual del Media Kit.
- La notificación Resend sigue siendo no bloqueante respecto de la persistencia en el servidor.

## 11C.6 — Estados de envío

Se revisaron los consumidores de `addLead`. Al convertir la API en la fuente autoritativa, los formularios que no manejaban excepciones podían quedar bloqueados en estado de envío o marcar éxito sin persistencia confirmada. Se añadió manejo `try/catch/finally` en `LandingView`, `InventoryCatalog`, `SubpageLayout` y `ContactView`. `LeadsModule` ya contaba con manejo de errores.

## 11C.2 — Semanas

El store normaliza el rango comercial a 1–8 semanas. Se alineó también el slider de `SubpageLayout` que todavía permitía seleccionar hasta 12 semanas.


## 11C.7 — QA responsive estático

- Media Kit: fechas pasan a una columna en viewport móvil y dos columnas desde `sm`.
- Descarga del Media Kit: botón ocupa el ancho disponible en móvil y conserva tamaño automático desde `sm`.
- Comparador flotante: márgenes laterales y posición inferior reducidos en móvil para evitar ocupar área excesiva.
- No se modificó estructura funcional, datos ni diseño Stitch.
- Validación dinámica bloqueada por dependencia `zustand@5.0.14` no disponible en el registry del entorno.
