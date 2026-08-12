# API Contract - /api/v1/quotes

**Fecha de Documentación:** 2024-05-25

Este documento describe el contrato funcional de la API v1 para la entidad `Quote`.

---

## 1. `GET /api/v1/quotes`

*   **Descripción:** Obtiene una lista de todas las cotizaciones para el tenant del usuario autenticado.
*   **Autenticación:** Requerida (`requireAuth`).
*   **Autorización:** Requiere permiso `view_quotes`.
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "quote_...",
          "status": "REQUESTED",
          "quotedPrice": 1500.00,
          "validUntil": "2024-12-31T23:59:59.000Z",
          "leadId": "lead_...",
          "userId": "user_...",
          "createdAt": "2024-05-20T10:00:00.000Z",
          "lead": {
            "id": "lead_...",
            "name": "Cliente Ejemplo S.A."
          }
        }
      ]
    }
    ```

---

## 2. `GET /api/v1/quotes/:id`

*   **Descripción:** Obtiene el detalle de una cotización específica, validando que pertenezca al tenant del usuario.
*   **Autenticación:** Requerida (`requireAuth`).
*   **Autorización:** Requiere permiso `view_quotes`.
*   **Respuesta Exitosa (200 OK):** Objeto de la cotización.
*   **Respuesta de Error (404 Not Found):** Si la cotización no existe o no pertenece al tenant.

---

## 3. `POST /api/v1/quotes`

*   **Descripción:** Crea una nueva cotización.
*   **Autenticación:** Requerida (`requireAuth`).
*   **Autorización:** Requiere permiso `create_quotes`.
*   **Payload (Body):** `leadId`, `screenIds`, `message`, `startDate`, `endDate`.
*   **Seguridad:** El `userId` y `tenantId` se obtienen de la sesión autenticada, no del body.
*   **Respuesta Exitosa (201 Created):** Objeto de la cotización creada.

---

## 4. `PUT /api/v1/quotes/:id`

*   **Descripción:** Actualiza una cotización (ej. estado, precio).
*   **Autenticación:** Requerida (`requireAuth`).
*   **Autorización:** Requiere permiso `edit_quotes`.
*   **Payload (Body):** `status`, `quotedPrice`, `adminComments`.
*   **Validaciones:**
    *   Valida que la cotización pertenezca al tenant.
    *   Aplica una máquina de estados para transiciones de `status` válidas.
*   **Respuesta Exitosa (200 OK):** Objeto de la cotización actualizada.

---