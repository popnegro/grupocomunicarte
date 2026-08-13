# AUDITORÍA DE INVENTARIO Y ARQUITECTURA — GRUPO COMUNICARTE

Este documento detalla el estado del proyecto tras la inspección inicial del espacio de trabajo.

## 1. INVENTARIO DEL ESTADO ACTUAL

El espacio de trabajo físico contiene una plantilla limpia de React 19 + Vite + Tailwind CSS v4. No se encuentran archivos previos de la aplicación "Grupo Comunicarte". 

### Dependencias Disponibles en `package.json`:
- `react` / `react-dom` (^19.0.1)
- `vite` (^6.2.3)
- `@tailwindcss/vite` (^4.1.14)
- `lucide-react` (^0.546.0)
- `motion` (^12.23.24) (Framer Motion)
- `express` (^4.21.2)
- `tsx` (^4.21.0)
- `esbuild` (^0.25.0)

## 2. ANÁLISIS DE RIESGOS Y DEUDA TÉCNICA

### CRITICAL (P0)
*   **Ausencia de Aplicación de Negocio:** No existen componentes, rutas, vistas, modelos de datos, bases de datos ni servidor Express configurados en el espacio de trabajo actual. La aplicación cargada es un div vacío.
*   **Seguridad / Exposición de Precios:** Es mandatario por reglas de negocio que la landing pública no muestre ningún precio, tarifa o coste comercial. Debemos diseñar la UI de forma tal que cualquier precio esté estrictamente ausente del frontend público y reemplazarlo por "Tarifa bajo cotización".

### HIGH (P1)
*   **Geolocalización Inexistente:** Se requiere un mapa interactivo completamente funcional para Mendoza y Buenos Aires con soporte para la categoría de "LED Móvil" y filtrado consistente. Al estar vacíos los datasets de origen, debemos construir un repositorio de datos de inventario completo y preciso.
*   **Gestión de Mediakits y Exportación:** El sistema requiere la capacidad de guardar selecciones de soportes publicitarios y exportarlas en un formato compatible o con estructura de Media Kit para los leads comerciales.
*   **Autenticación y Roles (RBAC):** Se requiere control de acceso diferenciado para `SúperAdmin` y `Admin` para resguardar la manipulación de inventario.

---

## 3. CLASIFICACIÓN DE MÓDULOS DE ARQUITECTURA

A continuación se resume el estado de los módulos esperados:

| Componente | Estado | Tipo de Hallazgo |
| :--- | :--- | :--- |
| **Landing pública** | Ausente | H. NO IMPLEMENTADO |
| **Inventario (Soportes/Plazas)** | Ausente | H. NO IMPLEMENTADO |
| **Mapa Interactivo (Mendoza/BA)** | Ausente | H. NO IMPLEMENTADO |
| **Dashboard Administrativo** | Ausente | H. NO IMPLEMENTADO |
| **Autenticación (Admin/SúperAdmin)** | Ausente | H. NO IMPLEMENTADO |
| **Persistencia de Datos (Base de Datos)**| Ausente | H. NO IMPLEMENTADO |
| **Generación de Media Kits** | Ausente | H. NO IMPLEMENTADO |
| **Formulario de Leads** | Ausente | H. NO IMPLEMENTADO |

---

## 4. CONCLUSIÓN DE AUDITORÍA
La aplicación debe desarrollarse de forma integral desde los cimientos, asegurando una separación absoluta de responsabilidades:
1.  **Backend (Express):** Implementar un servidor full-stack unificado en `server.ts` que sirva la API REST y almacene datos en un almacén persistente con estructura relacional JSON en el servidor para evitar caídas por variables de entorno y proveer una base de datos operativa out-of-the-box en Cloud Run.
2.  **Frontend (React):** Crear una UI elegante, responsiva, con transiciones suaves basadas en `motion` y con un sistema visual de alto nivel.
