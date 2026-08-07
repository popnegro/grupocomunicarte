# LeadMóvil DOOH Platform — Grupo Comunicarte (PMV Producción)

Plataforma integral de gestión publicitaria Smart OOH, inventario de pantallas LED, cotizaciones, analíticas de impacto y consola de administración DOOH.

---

## 🚀 Guía de Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- **Node.js**: v18 o superior
- **npm**: v9 o superior

### Pasos de Instalación

1. **Clonar o descargar el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITO>
   cd grupocomunicarte
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**:
   Copia el archivo `.env.example` a `.env` (o `.env.local` en desarrollo):
   ```bash
   cp .env.example .env
   ```
   Asigna las claves correspondientes (`GEMINI_API_KEY`, `VITE_ADMIN_EMAILS`, etc.).

4. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```
   Abre la aplicación en `http://localhost:3000`.

---

## 🛠️ Comandos Principales

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo Express + Vite en puerto 3000 |
| `npm run lint` | Ejecuta verificación estática de tipos con TypeScript (`tsc --noEmit`) |
| `npm run build` | Compila el frontend cliente en `dist/` y el servidor CJS en `dist/server.cjs` |
| `npm run start` | Inicia el servidor de producción optimizado desde `dist/server.cjs` |

---

## 🔑 Autenticación y Cuenta Administradora Principal

- La cuenta administradora principal por defecto es: **`grupo.comunicarte.dev@gmail.com`**.
- Las cuentas administradoras autorizadas se configuran mediante la variable de entorno `VITE_ADMIN_EMAILS` (separadas por comas) o mediante la colección de roles en Firestore, evitando codificar correos de forma rígida.
- El panel de administración (`/dashboard/admin`) está resguardado mediante `ProtectedRoute` con validación de rol `admin`.

---

## ☁️ Despliegue en Vercel / Cloud Run

### Despliegue Automático en Vercel
1. Conecta el repositorio GitHub a **Vercel**.
2. Framework Preset: **Vite / Node.js**.
3. Configura las **Environment Variables** en la consola de Vercel (ver `.env.example`).
4. Vercel utilizará la configuración definida en `vercel.json` y la ruta serverless `api/index.ts`.

### Despliegue en Google Cloud Run / Docker
1. Compilar el bundle de producción:
   ```bash
   npm run build
   ```
2. Ejecutar con Node.js en contenedor:
   ```bash
   npm run start
   ```
   El servidor responderá en el puerto `3000` en host `0.0.0.0`.

---

## 📋 Variables de Entorno Principales

Consulta `.env.example` para la lista completa.
- `GEMINI_API_KEY`: Clave de servidor para la IA de planificación comercial DOOH.
- `VITE_ADMIN_EMAILS`: Correos electrónicos autorizados con rol Administrador.
- `OFFICIAL_GMAIL_ACCOUNT`: Cuenta de Gmail oficial autorizada para la integración de Google Slides/Gmail.
- `DATABASE_URL` / `POSTGRES_URL`: Cadena de conexión para PostgreSQL / Cloud SQL (opcional).
- `RESEND_API_KEY`: Servicio de envío de notificaciones por email.

---

## 🛡️ Checklist de Producción
- [x] Verificación TypeScript limpia (`tsc --noEmit` sin errores)
- [x] Build de producción exitoso (`vite build` + `esbuild server.ts`)
- [x] Resguardo de rutas del Dashboard con `ProtectedRoute` y `ErrorBoundary`
- [x] Configuración de roles y administración desacoplada por variables de entorno
- [x] Sanitización de variables de entorno y prevención de fugas de secretos
- [x] Archivo `vercel.json` y entrada serverless `api/index.ts` probados y operativos

