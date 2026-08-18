# QA Report — Public PMV

## Gate

- Branch: `fix/stabilize-main`
- Preview: Vercel ephemeral deployment
- Build command: `tsc --noEmit && vite build`
- TypeScript gate: PASS
- Vite production build: PASS
- Existing unit/e2e test suite: none configured in the PMV package

## Smoke routes verified against preview

- `/`
- `/soportes`
- `/soluciones`
- `/inventario`
- `/nosotros`

## Routing fix

Added `vercel.json` SPA fallback so direct navigation to client-side routes resolves through `index.html`.

## Dependency fix

Declared `react-router-dom` explicitly in the PMV package because the application imports the router directly.

## Release decision

Preview validation passed. `main` was not modified or promoted.
