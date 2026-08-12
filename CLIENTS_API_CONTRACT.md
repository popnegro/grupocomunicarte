# API Contract - /api/clients (Legacy)

**Fecha de Documentación:** 2024-05-24

Este documento describe el contrato funcional de la API legacy `/api/clients` antes de su migración a la arquitectura v1. Sirve como baseline para la validación de regresión.

---

## 1. `GET /api/clients`

*   **Descripción:** Obtiene una lista de todos los clientes.
*   **Parámetros de Query:** Ninguno implementado.
*   **Autenticación:** Requerida (protegido por middleware `clerkAuth`).
*   **Respuesta Exitosa (200 OK):**
    ```json
    [
      {
        "id": "cl_...",
        "name": "Cliente Ejemplo S.A.",
        "contact": "contacto@ejemplo.com",
        "createdAt": "2023-10-01T12:00:00.000Z",
        "updatedAt": "2023-10-01T12:00:00.000Z"
      }
    ]
    ```

---

## 2. `GET /api/clients/:id`

*   **Descripción:** Obtiene un cliente por su ID.
*   **Parámetros de URL:** `id` (string).
*   **Autenticación:** Requerida.
*   **Respuesta Exitosa (200 OK):** Un objeto de cliente.
*   **Respuesta de Error (404 Not Found):** Si el cliente con el `id` especificado no existe.

---

## 3. `POST /api/clients`

*   **Descripción:** Crea un nuevo cliente.
*   **Autenticación:** Requerida.
*   **Payload (Body):**
    ```json
    {
      "name": "Nuevo Cliente",
      "contact": "nuevo@cliente.com"
    }
    ```
*   **Validaciones:** `name` y `contact` son obligatorios.
*   **Respuesta Exitosa (201 Created):** El objeto del cliente recién creado.

---

## 4. `PUT /api/clients/:id`

*   **Descripción:** Actualiza un cliente existente.
*   **Autenticación:** Requerida.
*   **Payload (Body):** Campos a actualizar (e.g., `name`, `contact`).
*   **Respuesta Exitosa (200 OK):** El objeto del cliente actualizado.

---