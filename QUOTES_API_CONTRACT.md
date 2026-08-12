# API Contract - /api/quotes (Legacy)

**Fecha de Documentación:** 2024-05-24

Este documento describe el contrato funcional inferido de la API legacy `/api/quotes` antes de su migración a la arquitectura v1.

---

## 1. `GET /api/quotes`

*   **Descripción:** Obtiene una lista de todas las cotizaciones, incluyendo la información del cliente asociado.
*   **Autenticación:** Requerida (`clerkAuth`).
*   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": "quote_...",
        "status": "SENT",
        "total": 1500.00,
        "validUntil": "2024-12-31T23:59:59.000Z",
        "clientId": "cl_...",
        "userId": "user_...",
        "createdAt": "2024-05-20T10:00:00.000Z",
        "client": {
          "id": "cl_...",
          "name": "Cliente Ejemplo S.A."
        }
      }
    ]
    ```

---

## 2. `POST /api/quotes`

*   **Descripción:** Crea una nueva cotización.
*   **Autenticación:** Requerida.
*   **Payload (Body):** `status`, `total`, `validUntil`, `clientId`, `userId`.
*   **Validaciones:** No hay validaciones explícitas en el handler legacy. El `userId` se confía desde el body.
*   **Respuesta Exitosa (201 Created):** El objeto de la cotización recién creada.

---