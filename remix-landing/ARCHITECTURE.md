# 🏛️ ARQUITECTURA DE LA APLICACIÓN — GRUPO COMUNICARTE S.A.

Este documento describe de manera formal el diseño de software de la plataforma comercial y administrativa de **Grupo Comunicarte S.A.** La aplicación está construida sobre una arquitectura full-stack moderna y desacoplada que separa de manera limpia la presentación, la orquestación y el acceso a datos.

---

## 1. Diagrama de Bloques General

```text
       LADO DEL CLIENTE (Navegador)               LADO DEL SERVIDOR (Cloud Run)
┌───────────────────────────────────────┐       ┌─────────────────────────────────────┐
│          REACT 19 + VITE              │       │               EXPRESS               │
│                                       │       │                                     │
│  ┌─────────────────────────────────┐  │       │  ┌───────────────────────────────┐  │
│  │   UI Components & Routing       │  │       │  │       API Endpoints           │  │
│  │   (Landing, Map, Dashboard)     │  │       │  │ (Auth, Inventory, Leads, MK)  │  │
│  └────────────────┬────────────────┘  │       │  └───────────────┬───────────────┘  │
│                   │                   │       │                  │                  │
│                   ▼                   │       │                  ▼                  │
│  ┌─────────────────────────────────┐  │       │  ┌───────────────────────────────┐  │
│  │        AppContext.tsx           │  │       │  │     Middleware Pipeline       │  │
│  │ (Auth Token, Selection Cart)    │  │       │  │ (RateLimit, CORS, JWT Auth)   │  │
│  └────────────────┬────────────────┘  │       │  └───────────────┬───────────────┘  │
└───────────────────┼───────────────────┘       └──────────────────┼──────────────────┘
                    │                                              │
                    │         Peticiones HTTPS (JSON)              │
                    └──────────────────────────────────────────────┘
                                           │
                                           ▼
                        ┌─────────────────────────────────────┐
                        │             BACKEND API             │
                        │                                     │
                        │     ┌─────────────────────────┐     │
                        │     │        DBService        │     │
                        │     │   (Repository Gate)     │     │
                        │     └────────────┬────────────┘     │
                        └──────────────────┼──────────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     ▼                                           ▼
       [Entorno Dev / Fallback]                    [Entorno Prod Corporativo]
       ┌───────────────────────┐                   ┌────────────────────────┐
       │   JSONRepository      │                   │     PostgreSQL         │
       │  (server-db.json)     │                   │  (Google Cloud SQL)    │
       └───────────────────────┘                   └────────────────────────┘
```

---

## 2. Frontend (React 19 + Vite)

El cliente es una aplicación de página única (SPA) optimizada para brindar microinteracciones de alta fluidez táctil y visual, respetando las pautas de accesibilidad WCAG AA.

*   **Pila de Tecnologías:** React 19.0.1, Vite 6.4.3, Tailwind CSS v4, Lucide React (íconos vectoriales), Motion/React (animaciones físicas).
*   **Gestión de Estado (`AppContext.tsx`):**
    *   **Sesión:** Administra la carga en memoria del token JWT, identificando roles (`SúperAdmin` / `Admin`) para habilitar dinámicamente secciones del dashboard de control.
    *   **Carrito de Selección:** Mantiene las vallas o pantallas seleccionadas por el anunciante a través de filtros y búsquedas entre sesiones del navegador (`localStorage`).
*   **Lienzo Cartográfico (InteractiveMap.tsx):**
    *   En lugar de depender de cargadores de mapas pesados, se implementó un **renderizador vectorial optimizado en 2D basado en HTML5 Canvas**.
    *   Mapea coordenadas GPS reales de Mendoza y Buenos Aires sobre planos locales.
    *   Para las pantallas `LED Móvil` (pantallas sobre camiones tecnológicos), lee una secuencia ordenada de coordenadas de rutas (`routePoints`) y traza un recorrido dinámico animado con un halo de luz de neón sobre las calles de la ciudad.

---

## 3. Backend (Express)

La orquestación se realiza mediante un servidor Node.js que unifica el suministro de endpoints lógicos y la entrega de activos del cliente.

*   **Pila de Tecnologías:** Express 4.21.2, TypeScript, tsx, esbuild.
*   **Proceso de Compilación de Producción:**
    *   Para evitar problemas de incompatibilidad de ESM/CJS de Node en frío y acelerar la inicialización en la nube, **`esbuild` unifica todo el backend TypeScript en un solo paquete consolidado en `/dist/server.cjs`** junto con sus mapas de origen (`sourcemaps`).
*   **Canales de Entrada y Middleware Pipeline:**
    1.  **Security Headers:** Inyección automatizada de cabeceras de protección MIME (`X-Content-Type-Options: nosniff`), anti-clickjacking (`X-Frame-Options: SAMEORIGIN`), control de referencias y transporte estricto (`Strict-Transport-Security`).
    2.  **CORS Guard:** Valida los orígenes permitidos directamente contra variables del entorno (`CORS_ORIGIN`), bloqueando accesos cruzados sospechosos.
    3.  **Rate Limiting:** Un módulo ligero de administración en memoria que frena de manera reactiva intentos de fuerza bruta en el login administrativo (máximo 10 peticiones/min) y spam en formularios de cotización (máximo 5 peticiones/min).
    4.  **JWT Verification:** Intercepta cabeceras `Authorization: Bearer <token>`, decodifica el payload y valida de manera criptográfica utilizando firmas seguras **HMAC-SHA256** antes de permitir la ejecución de operaciones protegidas.

---

## 4. Abstracción del Almacenamiento (Repository Pattern)

Para soportar las restricciones de infraestructuras serverless (como Google Cloud Run) sin requerir modificaciones en la lógica comercial ni en el código frontend, la persistencia se desacopla mediante el **Patrón de Repositorio**.

Este patrón se expone a través de la interfaz unificada de acceso de **`DBService`**.

### Esquema de la Abstracción de Datos

```text
                                  ┌───────────────────────────┐
                                  │         Controller        │
                                  │     (e.g., PUT /api/inv)  │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
                                  ┌───────────────────────────┐
                                  │         DBService         │
                                  │     (Fachada de Acceso)   │
                                  └─────────────┬─────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
        ┌─────────────────────────────┐                   ┌─────────────────────────────┐
        │       JSONRepository        │                   │     PostgreSQLRepository    │
        │ (Lectura/Escritura Atómica) │                   │ (Client pool con Drizzle/pg)│
        │      (server-db.json)       │                   │       (Base de Datos)       │
        └─────────────────────────────┘                   └─────────────────────────────┘
```

### Contrato de la Abstracción (`IRepository`)

La clase `DBService` actúa como el agente unificado que asegura las firmas de interfaz:

```typescript
// Estructura teórica de soporte para el cambio de repositorio en DBService
interface IRepository {
  // Soportes / Inventario
  getSupports(): Support[];
  getSupportById(id: string): Support | undefined;
  addSupport(support: Omit<Support, 'id'>): Support;
  updateSupport(id: string, support: Partial<Support>): Support;
  deleteSupport(id: string): boolean;

  // Leads / Formularios
  getLeads(): Lead[];
  addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead;
  updateLeadStatus(id: string, status: 'pending' | 'contacted' | 'rejected'): Lead;

  // MediaKits / Propuestas
  getMediaKits(): MediaKit[];
  addMediaKit(mediaKit: Omit<MediaKit, 'id' | 'createdAt'>): MediaKit;
  deleteMediaKit(id: string): boolean;
}
```

### Implementaciones

1.  **Modo de Desarrollo / Fallback local (JSONRepository):**
    *   *Mecanismo:* Lee y escribe de forma atómica y síncrona (`fs.readFileSync` y `fs.writeFileSync`) sobre `/server-db.json`.
    *   *Ventaja:* Portabilidad completa, cero dependencias externas de arranque, excelente velocidad de depuración.
    *   *Limitación de producción:* En plataformas serverless (Cloud Run elástico multirréplica), cada contenedor es efímero y corre sobre sistemas de archivos no compartidos. Los cambios se perderían al apagarse el contenedor o si la petición cae en un nodo diferente.
2.  **Modo Corporativo de Producción (PostgreSQLRepository):**
    *   *Mecanismo:* Se conecta mediante un pool de conexiones (`pg` o Drizzle ORM) a una base de datos centralizada de alta disponibilidad (como **Google Cloud SQL**).
    *   *Ventaja:* Persistencia duradera, transaccionalidad segura ante múltiples escrituras concurrentes, persistencia entre apagados y encendidos de contenedores serverless elásticos.
    *   *Transición:* Al implementar la interfaz de repositorio de `DBService`, el cambio de origen de datos se realiza en una sola clase de servicio del backend, dejando intactos todos los controladores de Express y las llamadas de la API de React.
