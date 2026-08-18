# PMV Público — Decisión de alcance

## Veredicto

**PMV PÚBLICO: READY para validación final de integración.**

La ausencia de `/login`, `/dashboard` y persistencia administrativa no bloquea este PMV porque esas capacidades pertenecen al producto administrativo posterior.

## Incluido

- Landing pública
- Navegación principal
- `/soportes`
- `/soluciones`
- `/nosotros`
- `/inventario`
- Mapa interactivo
- Filtros y sincronización con URL
- Selección de soportes
- Detalle de soporte
- Media Kit / contacto
- Responsive UI
- Sistema visual coherente

## Fuera de alcance del PMV público

- Autenticación administrativa
- Dashboard
- CRUD administrativo
- Persistencia de inventario
- Persistencia real de leads

## Estado técnico

- Branch de integración: `fix/stabilize-main`
- Branch espejo de auditoría: `audit/pmv-public-current`
- Root Vercel esperado: `audit/pmv-public-current`
- `https://grupocomunicarte.vercel.app/`: deployment de test interno, no URL final del cliente

## Criterio de promoción

No promover a producción del cliente hasta completar QA funcional del deployment de test y verificar explícitamente el root de Vercel, rutas públicas, assets, responsive y flujo Inventario → Selección → Media Kit/Contacto.
