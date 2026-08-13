# PLAN DE REFACTORIZACIÓN E IMPLEMENTACIÓN — GRUPO COMUNICARTE

Este plan detalla las fases y tareas que ejecutaremos de forma incremental para construir la plataforma unificada de comercialización y administración de soportes publicitarios para Grupo Comunicarte.

## FASE 3: INFRAESTRUCTURA Y CONFIGURACIÓN
*   **Modificar `package.json`:** Añadir scripts de desarrollo y compilación para soporte full-stack unificado (Express + Vite) con `esbuild` y `tsx` de acuerdo a las directrices de entorno.
*   **Crear `server.ts`:** Levantar el servidor Express básico en el puerto `3000` con integración de Vite en modo desarrollo y servicio estático para producción.
*   **Crear Estructura de Carpetas:** Crear `/src/components`, `/src/context`, `/src/types`, `/src/services`, `/server/data` para una separación clara de responsabilidades.

## FASE 4: CAPA DE DATOS Y PERSISTENCIA (BACKEND)
*   **Crear `server/db.json`:** Archivo que actuará como base de datos persistente real en el servidor.
*   **Crear `server/db.service.ts`:** Lógica de persistencia de datos (con soporte para transacciones simuladas estables, autoincremento de IDs, carga de fixtures por defecto de Mendoza, Buenos Aires y LED Móvil).
*   **Poblar Fixtures:** Datos con coordenadas geográficas correctas de Mendoza y Buenos Aires para todos los soportes publicitarios de Grupo Comunicarte.
*   **Crear Rutas de la API REST:**
    *   `/api/auth/login` y `/api/auth/logout` (Autenticación basada en roles)
    *   `/api/inventory` (CRUD de soportes)
    *   `/api/leads` (Registro y visualización de solicitudes de cotización/leads)
    *   `/api/mediakits` (Guardado y listado de Media Kits comerciales)

## FASE 5: CORE FRONTEND Y NAVEGACIÓN
*   **Definir `src/types/index.ts`:** Modelos de datos TypeScript rigurosos para Soportes, Leads, MediaKits, Usuarios y Estado de Sesión.
*   **Crear Contexto de Rutas y Navegación:** Sistema de enrutador basado en estado con soporte para URLs limpias, Hash-routing adaptativo y protección de rutas.
*   **Desarrollar Landing Pública:**
    *   Sección Hero con propuesta de valor de alto impacto.
    *   Filtros interactivos de Plaza (Mendoza, Buenos Aires) y Categoría (Tradicional, Pantallas LED, LED Móvil).
    *   Visor de Mapa Interactivo con geolocalización integrada para Mendoza y Buenos Aires.
    *   Componente de Ficha de Soporte (con slider de fotos/video de simulación y **ausencia absoluta de precios**).
    *   Carrito de Selección de Pantallas y Formulario de Solicitud de Cotización.
*   **Desarrollar Panel Administrativo (Dashboard):**
    *   Portal de Login Administrativo.
    *   Vista General con métricas clave (total de soportes, leads recibidos, media kits).
    *   CRUD de Inventario (formulario completo para Crear, Editar y Eliminar soportes).
    *   Bandeja de Leads (ver selecciones y solicitudes de cotización).
    *   Gestor de Media Kits (guardado y exportación de archivos estructurados compatibles con Google Slides).

## FASE 6: DESIGN SYSTEM Y TOKENS DE DISEÑO
*   **Integrar en `src/index.css`:** Centralización de variables semánticas de Tailwind v4 para colores corporativos, tipografía (Inter y Poppins), espaciado y radios de borde exactos.
*   **Implementar Transiciones y Microinteracciones:** Integrar animaciones fluidas de entrada, arrastre de carrito y modales usando la biblioteca `motion`.

## FASE 7: VALIDACIÓN Y QA
*   **Revisión Responsiva y de Accesibilidad:** Asegurar soporte nativo de viewport en todos los breakpoints móviles, contraste de fuentes y elementos semánticos interactivos.
*   **Ejecutar Linter y Compilador:** Garantizar cero advertencias mediante `lint_applet` y compilación verde mediante `compile_applet`.
