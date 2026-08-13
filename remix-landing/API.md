# DOCUMENTACIÓN DE LA API — GRUPO COMUNICARTE S.A.

Esta documentación detalla los endpoints, esquemas de entrada y políticas de seguridad implementadas en el servidor Express unificado de Grupo Comunicarte S.A.

---

## 🔒 Políticas Globales de Seguridad

1.  **Autenticación:** Todos los endpoints marcados como `Protegido` requieren la cabecera `Authorization: Bearer <JWT_TOKEN>` firmada con el algoritmo HMAC-SHA256 del servidor.
2.  **Rate Limiting (Control de Abuso):** 
    *   `/api/auth/login`: Máximo 10 intentos por minuto.
    *   `/api/leads` (POST): Máximo 5 envíos por minuto.
3.  **Sanitización:** Los mensajes y campos de texto planos recibidos por el público se sanitizan para neutralizar ataques de inyección HTML/XSS de manera automatizada.
4.  **Cero Exposición de Tarifas Públicas:** Ninguna API pública expone campos de precios o márgenes. El listado de inventario siempre devuelve fichas técnicas con estado *"Bajo cotización"*.

---

## 📋 Resumen de Endpoints

### 1. Endpoints Públicos

| Método | Endpoint | Descripción | Rate Limit |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Sonda de salud y vitalidad para balanceadores de carga y Cloud Run | No |
| **GET** | `/api/inventory` | Obtiene el inventario comercial de soportes (Mendoza y Buenos Aires) | No |
| **POST** | `/api/leads` | Envía una solicitud de cotización comercial (Formulario público) | Sí (5/min) |

### 2. Endpoints de Autenticación

| Método | Endpoint | Descripción | Rate Limit |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Autenticación de administradores. Devuelve un JWT firmado | Sí (10/min) |

### 3. Endpoints Administrativos (Protegidos)

| Método | Endpoint | Descripción | Rol Mínimo Requerido |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/leads` | Lista todas las solicitudes de cotización recibidas | **Admin** |
| **PUT** | `/api/leads/:id` | Modifica el estado de gestión de una solicitud comercial | **Admin** |
| **POST** | `/api/inventory` | Registra un nuevo soporte publicitario en el inventario | **Admin** |
| **PUT** | `/api/inventory/:id` | Edita los metadatos de un soporte publicitario | **Admin** |
| **DELETE** | `/api/inventory/:id` | Elimina definitivamente un soporte del inventario | **SúperAdmin** |
| **GET** | `/api/mediakits` | Lista todos los Media Kits comerciales guardados | **Admin** |
| **POST** | `/api/mediakits` | Genera y almacena una propuesta comercial / Media Kit | **Admin** |
| **DELETE** | `/api/mediakits/:id` | Elimina una propuesta comercial guardada | **SúperAdmin** |

---

## 🛠️ Detalles por Endpoint

### `GET /health`
Devuelve el estado operativo de los subsistemas.
*   **Response (200 OK):**
    ```json
    {
      "status": "ok",
      "application": "ok",
      "database": "ok"
    }
    ```

---

### `POST /api/auth/login`
Autentica a un usuario administrador utilizando hashing PBKDF2 robusto y emite un token criptográfico.
*   **Payload:**
    ```json
    {
      "email": "superadmin@grupocomunicarte.com",
      "password": "supercomunicarte2026!"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "uid": "sa1",
        "email": "superadmin@grupocomunicarte.com",
        "name": "Director General",
        "role": "SúperAdmin"
      }
    }
    ```

---

### `POST /api/leads`
Registra una solicitud de contacto y plan de medios del cliente. Valida tipos de datos, correos e inyecciones maliciosas.
*   **Payload:**
    ```json
    {
      "name": "Juan Pérez",
      "company": "Medios Mendoza",
      "email": "juan@mediosmendoza.com.ar",
      "phone": "+54 261 4556677",
      "message": "Solicitud de prueba de campaña LED para Septiembre.",
      "selectedSupportIds": ["mendoza-led-1"],
      "plazaContext": "Mendoza"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Solicitud de cotización registrada con éxito.",
      "lead": {
        "id": "lead-1753904926",
        "name": "Juan Pérez",
        "company": "Medios Mendoza",
        "email": "juan@mediosmendoza.com.ar",
        "phone": "+54 261 4556677",
        "message": "Solicitud de prueba de campaña LED para Septiembre.",
        "selectedSupportIds": ["mendoza-led-1"],
        "plazaContext": "Mendoza",
        "createdAt": "2026-08-12T19:00:00.000Z",
        "status": "pending"
      }
    }
    ```

---

### `POST /api/mediakits`
Genera una propuesta comercial estructurada en JSON ("Google Slides Ready") para ser procesada por APIs corporativas en la nube.
*   **Headers:** `Authorization: Bearer <JWT>`
*   **Payload:**
    ```json
    {
      "title": "Campaña Primavera - Coca Cola",
      "clientName": "Coca Cola Andina",
      "plaza": "Mendoza",
      "comments": "Incluye posicionamiento preferencial en pantallas LED",
      "supportIds": ["mendoza-led-1", "mendoza-led-2"],
      "slidesLayout": "Modern Pitch"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "id": "mediakit-1753905000",
      "title": "Campaña Primavera - Coca Cola",
      "clientName": "Coca Cola Andina",
      "plaza": "Mendoza",
      "comments": "Incluye posicionamiento preferencial en pantallas LED",
      "supportIds": ["mendoza-led-1", "mendoza-led-2"],
      "slidesLayout": "Modern Pitch",
      "createdAt": "2026-08-12T19:05:00.000Z"
    }
    ```
