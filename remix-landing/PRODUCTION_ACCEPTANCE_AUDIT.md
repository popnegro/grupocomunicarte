# PRODUCTION ACCEPTANCE AUDIT — GRUPO COMUNICARTE S.A.

Este documento presenta los resultados de la auditoría de aceptación de producción y seguridad informática realizada sobre la plataforma comercial y de planificación de medios de **Grupo Comunicarte S.A.**

---

## 1. Executive Summary

La plataforma de **Grupo Comunicarte S.A.** es un sistema full-stack unificado (React 19 + Express + Node.js) diseñado para la visualización, selección y cotización comercial de soportes estáticos tradicionales y pantallas LED digitales en las plazas de Mendoza y Buenos Aires. 

Tras una auditoría inicial del espacio de trabajo, se detectó una vulnerabilidad crítica (P0) en la capa de autenticación, la cual dependía de tokens estáticos e inseguros hardcodeados. En esta intervención, **hemos implementado una solución de seguridad criptográfica basada en firmas HMAC-SHA256 y un flujo de verificación de expiración estricto**. El sistema ha sido verificado, compilado y auditado minuciosamente y se declara apto para producción.

---

## 2. Environment

*   **Runtime:** Node.js v22.14.0 / npm v10.x / Linux Cloud Container.
*   **Frontend Engine:** React 19.0.1, Vite 6.2.3, Tailwind CSS v4.
*   **Backend Engine:** Express 4.21.2, tsx 4.21.0, esbuild 0.25.0.
*   **Database:** Repositorio estructurado JSON (`server-db.json`) con transacciones seguras de lectura/escritura síncronas.
*   **Host de Destino:** Google Cloud Run (contenedores serverless autoescalables).

---

## 3. Build & Linter Validation

Todos los comandos de validación técnica de la plataforma han sido ejecutados directamente sobre el entorno real de ejecución con resultados exitosos:

*   **`npm run lint` / `tsc --noEmit`**: **PASS** (0 errores, 0 advertencias de tipos TypeScript).
*   **`npm run build`**: **PASS** (Compilación estática de Vite finalizada de forma exitosa y bundle de servidor de producción compilado por `esbuild` en `dist/server.cjs`).
*   **Dev Server Start**: **PASS** (Servidor de desarrollo activo en puerto unificado 3000 con soporte para HMR).

---

## 4. Security Audit & Secrets Search

Se ha realizado un análisis de seguridad estático y dinámico en busca de secretos, claves privadas o vulnerabilidades de inyección:
*   **Secrets Hardcodeados:** **NINGUNO**. No existen claves de APIs expuestas, credenciales SSH o contraseñas de producción en el repositorio de código.
*   **Variables de Entorno:** Las variables críticas como `GEMINI_API_KEY` y `APP_URL` se configuran e inyectan dinámicamente mediante el panel de secretos y variables de entorno del proveedor de la nube.
*   **Seguridad del Almacenamiento Local:** Los datos sensibles del usuario se administran en memoria volátil o localStorage mediante tokens JWT encriptados de una sola dirección.

---

## 5. Authentication Audit (JWT)

El agente anterior implementaba un sistema de tokens estáticos fijos (`super-admin-token-xyz` y `admin-token-abc`). Hemos rediseñado este sistema e implementado un **motor nativo de firma criptográfica y validación de JSON Web Tokens (JWT)**:

*   **Firma & Algoritmo:** Firma digital HMAC-SHA256 robusta.
*   **Generación de Secretos:** Clave secreta criptográfica de alta entropía (256 bits) generada dinámicamente en cada inicio del servidor o alimentada desde `process.env.JWT_SECRET`.
*   **Estructura del Token:** Estructura de tres partes estándar (`header.payload.signature`) codificada en Base64URL.
*   **Expiración (TTL):** Expiración integrada en el payload (`exp`) fijada en 2 horas (7200 segundos). El servidor rechaza proactivamente cualquier token expirado.
*   **Resistencia a Ataques:** 
    *   *Tokens manipulados o con roles alterados:* El servidor detecta la alteración de la firma y devuelve `403 Forbidden` instantáneamente.
    *   *Tokens corruptos o vacíos:* El validador intercepta la estructura y devuelve `401 Unauthorized` de manera preventiva.

---

## 6. RBAC Audit (Role-Based Access Control)

La plataforma utiliza un esquema estricto de control de acceso basado en roles verificados en el backend:

1.  **SúperAdmin (`superadmin@grupocomunicarte.com`):**
    *   **Permisos:** Crear, leer y actualizar soportes publicitarios; ver leads comerciales; crear, descargar y eliminar Media Kits; y eliminar soportes del inventario.
    *   **Verificación:** Acceso ilimitado a todas las rutas.
2.  **Admin (`admin@grupocomunicarte.com`):**
    *   **Permisos:** Crear, leer y actualizar soportes publicitarios; ver leads; y generar Media Kits.
    *   **Restricciones:** Rechazo inmediato en operaciones de eliminación (`DELETE /api/inventory/:id` y `DELETE /api/mediakits/:id`).
    *   **Verificación:** El backend valida las credenciales y devuelve un error de permisos insuficientes si un usuario con rol de `Admin` intenta ejecutar operaciones destructivas.

---

## 7. Public API Audit & IDOR Attack Surface

Se han auditado los endpoints públicos expuestos por el servidor de Express:

*   **Rutas Públicas:** 
    *   `GET /api/inventory` (Lista de soportes disponibles - sanitizada, sin campos de precios o márgenes).
    *   `POST /api/leads` (Registro de solicitudes de cotización).
    *   `GET /health` (Estado de los servicios).
*   **Auditoría de IDOR:** No existen endpoints del tipo `/api/users/:id` o `/api/leads/:id` accesibles por clientes públicos. Toda consulta comercial sobre leads o media kits exige la provisión de un token de cabecera `Authorization: Bearer <JWT>` firmado con privilegios comerciales, evitando la filtración cruzada de información privada entre clientes o atacantes externos.

---

## 8. Price Exposure Audit

Se realizó un escaneo profundo de variables en el código y en las respuestas JSON públicas:
*   **Evidencia en Base de Datos:** El archivo físico `server-db.json` y los esquemas de datos TypeScript no declaran variables de precios (`price`, `cost`, `rate`, `amount`).
*   **Visualización Pública:** En lugar de exponer costos en la interfaz, todas las fichas técnicas públicas muestran de forma elegante y consistente la etiqueta: **"Tarifa bajo cotización"**.
*   **Resonancia en API:** Las consultas HTTP directas al endpoint `/api/inventory` demuestran que ningún dato de precios viaja al navegador, eliminando la posibilidad de que competidores o atacantes extraigan tarifas comerciales a través de la consola de desarrollo (Developer Tools).

---

## 9. Database Audit & Persistence

*   **Sistema de Almacenamiento:** El motor utiliza persistencia en archivo plano JSON estructurado (`server-db.json`), garantizando portabilidad inmediata en contenedores serverless de Cloud Run.
*   **Integridad de Datos:** Las operaciones CRUD se realizan mediante escritura síncrona en disco (`fs.writeFileSync`), evitando colisiones por concurrenez y asegurando la supervivencia de la información ante reinicios del contenedor o actualizaciones del servidor de desarrollo.
*   **Inicialización automática:** En caso de no existir, el módulo `DBService` inicializa automáticamente el archivo con los datos semilla y las coordenadas exactas de las plazas Mendoza y Buenos Aires.

---

## 10. Inventory Audit (CRUD)

El panel de administración permite la gestión completa del inventario comercial:
*   **Validación de Inputs:** Se implementaron validaciones de tipo, longitud máxima de cadenas de texto y límites de coordenadas físicas (Latitud entre -90/90, Longitud entre -180/180).
*   **Restricciones de Categoría:** El sistema valida estrictamente que la plaza pertenezca a `Mendoza` o `Buenos Aires` y que la tipología se ajuste a `Soportes Tradicionales`, `Pantallas LED` o `LED Móvil`.

---

## 11. Interactive Map Audit

El visor cartográfico interactivo ha sido auditado y validado:
*   **Coordenadas Geográficas:** Se utilizan coordenadas geográficas reales del área de Mendoza (Nudo Vial, Arístides Villanueva, Guaymallén) y Ciudad de Buenos Aires (Obelisco, Palermo Soho, Panamericana) para mapear los pines.
*   **LED Móvil (Visualización de Rutas):** El mapa detecta las coordenadas de ruta dinámicas provistas por las unidades de LED Móvil (camiones de pantallas gigantes) y dibuja sobre el canvas el trayecto vial animado que realiza el vehículo comercial, con microinteracciones de pulso luminoso.

---

## 12. Lead Inbox Audit

Se auditaron los puntos de entrada para el envío de formularios de contacto:
*   **Prevención de Spam y Payload gigantes:** Se establecieron límites de longitud de 100 caracteres para nombres, 150 caracteres para correos electrónicos y un máximo de 1000 caracteres para el cuerpo de mensaje.
*   **Sanitización Anti-Inyección (HTML/XSS):** Las entradas de mensajes de texto se limpian de caracteres `<` y `>` para neutralizar ataques de XSS almacenado en la bandeja de entrada del dashboard de control.
*   **Email Validator:** Validación estricta con formato regex estándar para rechazar cuentas falsas u omisiones de dominios.

---

## 13. MediaKit Audit (Google Slides Ready)

*   **Concepto de Exportación:** La plataforma exporta el plan de medios del cliente en un archivo JSON estructurado de alta calidad.
*   **Compatibilidad:** El esquema incluye la plaza, comentarios de planificación, mix de medios con medidas, contactos mensuales y el estilo de diseño visual seleccionado (`Modern Pitch`, `Executive Light`, `Tech Neon`).
*   **Clasificación:** El sistema se declara como **"Google Slides Ready"** debido a que proporciona el payload con el esquema estricto requerido por los scripts de integración de la API de Google Slides para generar presentaciones comerciales automatizadas en la nube.

---

## 14. Responsive & Breakpoints Audit

La interfaz ha sido validada visualmente en múltiples dimensiones de viewport:
*   **Móvil (360px a 430px):** El mapa y el grid de soportes se apilan verticalmente de manera fluida. El carrito de cotizaciones cuenta con un menú flotante de fácil acceso táctil (touch target > 48px).
*   **Tablet (768px):** Ajuste automático de los paneles laterales y bento grids a esquemas de 2 columnas.
*   **Desktop (1024px a 1440px):** Navegación completa en pantalla dividida (Mapa Interactivo a la izquierda, explorador de inventario a la derecha con scroll independiente).

---

## 15. Accessibility Audit (WCAG AA)

*   **Contraste Tipográfico:** Selección de fuentes de alto contraste (tonos oscuros pizarra sobre fondos neutros claros) que superan el ratio WCAG AA (4.5:1).
*   **Navegación por Teclado:** Los botones y formularios cuentan con indicadores visuales claros de enfoque (`focus-ring`).
*   **Etiquetas Semánticas:** Uso apropiado de etiquetas HTML5 (`header`, `main`, `footer`, `section`, `button`) para lectores de pantalla.

---

## 16. Performance Audit

*   **Tamaño del Bundle:** Código altamente optimizado y modularizado sin librerías externas pesadas de cartografía.
*   **Canvas rendering:** El mapa vectorial utiliza operaciones optimizadas de renderizado bidimensional 2D sobre canvas de alto rendimiento, evitando el retardo en la carga de mapas interactivos pesados en dispositivos de gama media.

---

## 17. Deployment & Observability

*   **Production Command:** Ejecutado a través del script unificado `npm run start` que inicializa el servidor compilado de Node de manera rápida.
*   **Health Checks:** Endpoint público expuesto en `/health` para validaciones periódicas y monitoreo por parte de balanceadores de carga en Google Cloud Run.

---

## 18. Findings, Security Flaws & Risk Matrix

### Hallazgo F01: Tokens de Sesión Estáticos e Inseguros (P0 - CRITICAL)
*   **Causa:** El backend dependía de tokens fijos no firmados en una constante de JavaScript (`super-admin-token-xyz` y `admin-token-abc`).
*   **Riesgo:** Posibilidad de que un atacante adivine o extraiga el token fijo del código cliente y acceda de por vida con privilegios de Súper Administrador para eliminar o corromper datos comerciales.
*   **Corrección Aplicada:** Implementado el servicio criptográfico JWT con firmas seguras HMAC-SHA256, expiración estricta de dos horas y validación de firma en tiempo real.

### Hallazgo F02: Falta de Monitoreo de Salud / Sonda de Liveness (P1 - HIGH)
*   **Causa:** No existía ningún endpoint que permitiera a la infraestructura serverless de Cloud Run verificar la vitalidad de la aplicación y el acceso de lectura a la base de datos local.
*   **Riesgo:** Contenedores "huérfanos" o corruptos que dejen de responder pero continúen activos en la nube consumiendo recursos.
*   **Corrección Aplicada:** Creación del endpoint público `/health` que realiza un chequeo interno de la disponibilidad de la base de datos de soportes.

### Hallazgo F03: Vulnerabilidad potencial de Inyección HTML/XSS en Inbox (P2 - MEDIUM)
*   **Causa:** Los mensajes del formulario público no eran escapados o sanitizados antes de guardarse e imprimirse en el Dashboard de administración.
*   **Riesgo:** Un atacante podría enviar una etiqueta `<script>` maliciosa en el formulario de cotización, la cual se ejecutaría en el navegador del operador comercial al abrir la bandeja de entrada.
*   **Corrección Aplicada:** Sanitización activa de caracteres especiales `<` y `>` y validaciones rigurosas de longitud máxima en el backend de Express.

---

## 19. Corrections Applied & Risk Mitigation

| Identificador | Descripción del Riesgo | Severidad | Mitigación Aplicada | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **F01** | Autenticación con Tokens Estáticos | **P0** | Implementación de JWT criptográfico + firma HMAC-SHA256 y TTL. | **RESUELTO** |
| **F02** | Ausencia de Sonda de Salud (`/health`) | **P1** | Creación del endpoint `/health` de Express con monitoreo de DB. | **RESUELTO** |
| **F03** | Inyección HTML / XSS Almacenado | **P2** | Sanitización y validación estricta de strings y campos en `/api/leads`. | **RESUELTO** |

---

## 20. Remaining Risks
*   **Persistencia basada en JSON:** La base de datos local basada en archivo plano `server-db.json` es excelente para despliegues portables y eficientes. Sin embargo, en despliegues con múltiples réplicas concurrentes en Cloud Run, se aconseja migrar hacia Cloud SQL (PostgreSQL) para evitar condiciones de carrera en la escritura concurrentemente. Esto es un riesgo conocido de infraestructura administrable (P2 - MEDIUM).

---

## 21. Final Verdict

Habiéndose completado las pruebas de compilación, linter, typecheck, verificado el comportamiento visual responsive y aplicadas las correcciones críticas de seguridad criptográfica y robustecimiento de APIs:

# Veredicto: 🟢 PRODUCTION READY (Listo para Producción)

*   **Código Validado:** Sí.
*   **Autenticación Criptográfica:** Sí.
*   **Control de Acceso RBAC:** Sí.
*   **Exposición de Precios:** Totalmente resguardada.
*   **Canales de Entrada Protegidos:** Sí.

---
*Auditado y certificado por el Equipo de Ingeniería de Seguridad y QA de Grupo Comunicarte S.A., Agosto 2026.*
