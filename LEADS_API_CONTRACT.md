# API Contract - /api/leads (Legacy)

**Fecha de Documentación:** 2024-05-24

Este documento describe el contrato funcional de la API legacy `/api/leads` antes de su migración a la arquitectura v1.

---

## 1. `GET /api/leads`

*   **Descripción:** Obtiene una lista de todos los leads, incluyendo la información del cliente y usuario asociados.
*   **Parámetros de Query:** Ninguno implementado.
*   **Autenticación:** Requerida (protegido por middleware `clerkAuth`).
*   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": "lead_...",
        "status": "PENDING",
        "notes": "Llamar la próxima semana.",
        "clientId": "cl_...",
        "userId": "user_...",
        "createdAt": "2023-11-01T10:00:00.000Z",
        "updatedAt": "2023-11-01T10:00:00.000Z",
        "client": {
          "id": "cl_...",
          "name": "Cliente Ejemplo S.A."
        },
        "user": {
          "id": "user_...",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
    ```

---

## 2. `POST /api/leads`

*   **Descripción:** Crea un nuevo lead.
*   **Autenticación:** Requerida.
*   **Payload (Body):** `status`, `notes`, `clientId`, `userId`.
*   **Validaciones:** No hay validaciones explícitas en el handler legacy más allá de las restricciones del modelo Prisma.
*   **Respuesta Exitosa (201 Created):** El objeto del lead recién creado.

---