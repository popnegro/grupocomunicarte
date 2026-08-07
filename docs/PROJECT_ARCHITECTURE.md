# PROJECT ARCHITECTURE

## Product

Plataforma comercial DOOH para gestión de soportes publicitarios.

---

# PRODUCT OBJECTIVE

Permitir que un ejecutivo comercial pueda:

1. Consultar inventario.
2. Seleccionar soportes.
3. Crear una propuesta.
4. Generar Media Kit.
5. Compartir con clientes.

---

# USER FLOW

```
Landing Pública

↓

Lead

↓

Login

↓

Dashboard

↓

Inventario

↓

Seleccionar Soportes

↓

Cliente

↓

Media Kit

↓

Google Slides

↓

PDF

↓

Compartir
```

---

# FRONTEND ARCHITECTURE

Stack:

- React
- Vite
- TypeScript
- Tailwind CSS

Responsabilidades:

- UI.
- Navegación.
- Estado visual.
- Experiencia usuario.

---

# BACKEND ARCHITECTURE

Stack:

- Node.js
- Express

Responsabilidades:

- APIs.
- Seguridad.
- Integraciones.
- Lógica comercial.

---

# DATABASE

Tecnología:

- PostgreSQL.
- Drizzle ORM.

Entidades principales:

```
Users

Clients

Screens

Campaigns

MediaKits

Proposals

Revenue
```

---

# AUTHENTICATION

Proveedor:

Firebase Authentication.

Roles:

```
Admin

Commercial

Viewer
```

---

# GOOGLE WORKSPACE

Integraciones:

```
Google OAuth

Google Picker

Google Drive API

Google Slides API
```

Objetivo:

Crear propuestas comerciales automáticamente.

---

# PMV PRIORITIES

## P0

Obligatorio:

- Login.
- Dashboard.
- Inventario.
- Clientes.
- Media Kit.
- Google Slides.
- PDF.

---

## P1

Post PMV:

- Gemini Planner.
- Gmail API.
- Pipeline comercial.

---

## P2

Evolución:

- IA predictiva.
- Analítica avanzada.
- Facturación automática.

---

# NON GOALS

No agregar:

- funcionalidades sin impacto comercial;
- dashboards innecesarios;
- complejidad técnica.

---

# PRODUCTION PRINCIPLES

Todo desarrollo debe mantener:

- simplicidad;
- estabilidad;
- seguridad;
- escalabilidad;
- mantenibilidad.