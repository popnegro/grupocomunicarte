# Grupo Comunicarte — PMV Público

Aplicación web pública de Grupo Comunicarte para explorar soportes de publicidad exterior, consultar ubicaciones y preparar solicitudes comerciales.

## Alcance actual

- Landing pública
- Soportes
- Soluciones
- Nosotros
- Inventario interactivo
- Filtros por plaza, tipo, disponibilidad y búsqueda
- Selección de soportes
- Media Kit / contacto
- Diseño responsive

## Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- React Router
- React Leaflet
- Motion

## Desarrollo local

```bash
npm install
npm run dev
```

## Validación

```bash
npm run lint
npm run build
```

## Deployment de prueba

El deployment de `https://grupocomunicarte.vercel.app/` es exclusivamente un entorno de test interno. No constituye la URL pública/final del cliente.

El root de Vercel para este PMV debe apuntar a:

`audit/pmv-public-current`

## Nota de alcance

Este repositorio contiene el PMV público. La autenticación administrativa, dashboard, CRUD persistente de soportes y persistencia real de leads pertenecen a la siguiente capa de producto y no deben confundirse con un bloqueo del PMV público.
