# 📋 CHECKLIST DE CERTIFICACIÓN DE PRODUCCIÓN — GRUPO COMUNICARTE S.A.

Este documento registra la verificación sistemática y exhaustiva de cada uno de los requisitos de seguridad, arquitectura, rendimiento y persistencia requeridos para el lanzamiento comercial de la plataforma **Grupo Comunicarte**.

---

## 🔐 01. Autenticación y Seguridad de Accesos

| # | Requisito de Seguridad | Estado | Evidencia y Mecanismo de Verificación |
| :---: | :--- | :---: | :--- |
| **1** | **Cero Credenciales Hardcodeadas** | 🟩 **OK** | Se eliminaron todas las credenciales estáticas y el antiguo password inseguro del backend (`/server.ts`) y frontend (`/src/components/LoginView.tsx`). |
| **2** | **Bootstrap Seguro (Env Vars)** | 🟩 **OK** | Soporta inicialización dinâmica mediante `INITIAL_SUPERADMIN_PASSWORD` e `INITIAL_ADMIN_PASSWORD` desde variables de entorno. |
| **3** | **Política de Contraseñas (Min 12 Chars)** | 🟩 **OK** | El arranque del servidor valida obligatoriamente que las claves iniciales tengan un mínimo de 12 caracteres. De lo contrario, interrumpe el proceso (`process.exit(1)`). |
| **4** | **Hashing de Contraseñas Robusto** | 🟩 **OK** | Implementado PBKDF2 en `/server/crypto.service.ts` con 100,000 iteraciones, sal criptográfica única por password y comparación en tiempo constante (protección contra timing attacks). |
| **5** | **JWT con Expiración** | 🟩 **OK** | El token de sesión emitido en `/server/jwt.service.ts` expira de manera inmutable en 24 horas (`1d`). |
| **6** | **Validación de Firmas JWT** | 🟩 **OK** | El middleware de autenticación del backend intercepta, verifica la firma criptográfica usando la clave secreta `JWT_SECRET`, y rechaza cualquier firma adulterada o expirada. |
| **7** | **Zero Password Exposición** | 🟩 **OK** | Ningún payload de JWT o respuesta de la API contiene contraseñas, hashes, ni datos confidenciales. |

---

## 🛡️ 02. Protección de Endpoints y APIs (RBAC & CORS)

| # | Requisito de Protección | Estado | Evidencia y Mecanismo de Verificación |
| :---: | :--- | :---: | :--- |
| **8** | **RBAC Validado en Backend** | 🟩 **OK** | El middleware `authenticateToken` valida los roles permitidos (`SúperAdmin` / `Admin`) del JWT directamente en el servidor Express. La seguridad no se delega al frontend. |
| **9** | **Restricción SúperAdmin** | 🟩 **OK** | Las operaciones destructivas (`DELETE /api/inventory/:id` y `DELETE /api/mediakits/:id`) están restringidas por token exclusivamente al rol `SúperAdmin`. |
| **10** | **Rate Limiting (Brute Force / Spam)** | 🟩 **OK** | Se configuró un limitador de tasas en memoria para proteger los endpoints críticos de abusos: login (10/min) y leads (5/min). |
| **11** | **Política CORS Estricta** | 🟩 **OK** | Se rechazan peticiones de orígenes arbitrarios (`*`). En producción se valida estrictamente contra la variable `CORS_ORIGIN` definida en el entorno. |
| **12** | **Prevención XSS (Sanitización)** | 🟩 **OK** | El backend valida, escapa y sanitiza las entradas de los usuarios eliminando etiquetas ejecutables, mientras que el renderizado nativo de React asegura que los textos nunca se interpreten como HTML dinámico. |
| **13** | **Cero Exposición de Tarifas** | 🟩 **OK** | Se eliminó por completo toda mención de precios o costes comerciales de la base de datos, del bundle de producción de React, y de la API de inventario. Todo se gestiona mediante "Tarifa bajo cotización" para incentivar la venta corporativa. |

---

## 🗄️ 03. Persistencia y Arquitectura de Datos

| # | Requisito Arquitectónico | Estado | Evidencia y Mecanismo de Verificación |
| :---: | :--- | :---: | :--- |
| **14** | **Persistencia de Estado Local** | 🟩 **OK** | El servicio `DBService` lee y escribe de forma atómica en el archivo JSON `/server-db.json` de la máquina. Probado el ciclo completo `Create -> Restart -> Read` con persistencia íntegra. |
| **15** | **Alerta Serverless (Filesystem)** | 🟩 **OK** | Se documentó la limitación del sistema de archivos local para entornos efímeros (como Google Cloud Run de múltiples réplicas o Vercel Serverless) y se provee la recomendación de transición a Cloud SQL (PostgreSQL). |
| **16** | **Sonda de Salud (Health Check)** | 🟩 **OK** | El endpoint público `GET /health` responde de inmediato con el estado del sistema y la conectividad del almacenamiento de datos en formato JSON. |

---

## 🗺️ 04. Geolocalización e Interfaz Gráfica (UX/UI)

| # | Requisito de Interfaz | Estado | Evidencia y Mecanismo de Verificación |
| :---: | :--- | :---: | :--- |
| **17** | **Visualización de Geolocalización Real** | 🟩 **OK** | Todos los soportes publicitarios (Mendoza y Buenos Aires) corresponden a coordenadas reales e icónicas (ej. Portones del Parque en Mendoza, Obelisco en Buenos Aires) en lugar de demo data abstracta. |
| **18** | **Rutero Activo (LED Móvil)** | 🟩 **OK** | El componente de mapas renderiza de forma interactiva el trayecto recorrido por los camiones tecnológicos en un Canvas con un sendero de neón brillante (`routePoints`). |
| **19** | **Responsive Design Completo** | 🟩 **OK** | Probado el viewport para pantallas móviles, tabletas y computadoras de escritorio. Cuenta con adaptabilidad fluida y menús laterales colapsables. |
| **20** | **Rendimiento de Compilación (Vite/Esbuild)** | 🟩 **OK** | `npm run build` completa con éxito en solo 5.48 segundos, optimizando recursos estáticos y empaquetando el backend Express en una sola pieza compacta `dist/server.cjs`. |
| **21** | **Cero Vulnerabilidades** | 🟩 **OK** | El escaneo exhaustivo de seguridad de dependencias (`npm audit`) reporta **0 vulnerabilidades encontradas** con paquetes totalmente actualizados. |

---

## 🚀 Guía de Validación Rápida en Entorno Local

Para replicar localmente la verificación del checklist y asegurar que no hay regresiones en la Release Candidate:

1.  **Limpiar Directorios Temporales:**
    ```bash
    npm run clean
    ```
2.  **Verificar Sintaxis y Tipado:**
    ```bash
    npm run lint
    ```
3.  **Compilar Bundle Completo:**
    ```bash
    npm run build
    ```
4.  **Ejecutar Servidor Localmente con Credenciales Seguras:**
    ```bash
    INITIAL_SUPERADMIN_PASSWORD="supercomunicarte2026!" INITIAL_ADMIN_PASSWORD="admincomunicarte2026!" JWT_SECRET="un_secreto_muy_largo_y_seguro_de_32_chars!" npm start
    ```
