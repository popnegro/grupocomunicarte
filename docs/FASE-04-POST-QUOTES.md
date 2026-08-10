# FASE 04 — POST /api/quotes

## Objetivo

Completar la creación de cotizaciones y conectar el envío real del Media Kit con la entidad `quotes`.

## Contrato público

`POST /api/quotes` es público porque la solicitud comercial nace en la Landing sin autenticación Firebase.

El tenant se obtiene exclusivamente de `DEFAULT_TENANT_ID`; el cliente no puede enviar ni sobrescribir `tenantId`.

El endpoint crea un Lead comercial y luego una Quote asociada al lead. La cotización queda en estado `REQUESTED` y sin precio (`quotedPrice = null`).

## Flujo

```text
Landing → Explorador / Ubicaciones Destacadas → Media Kit → POST /api/quotes → Lead + Quote REQUESTED → Dashboard
```

## Seguridad

- No aceptar `tenantId` desde el frontend.
- Verificar que todos los `requestedScreens` pertenecen al tenant configurado.
- GET/PUT de quotes continúan protegidos por Firebase + tenant.
