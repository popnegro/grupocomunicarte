# Changelog

## 2026-08-17 — Autonomous stabilization / PMV public

- Continued stabilization on `fix/stabilize-main` without modifying `main`.
- Confirmed the public PMV route set includes `/`, `/nosotros`, `/espacios-publicitarios`, `/soluciones`, `/soportes`, and `/contacto`.
- Kept `/login` and `/dashboard` isolated as protected application functionality; they are not PMV-public acceptance blockers.
- Confirmed `grupocomunicarte.vercel.app` is a test/staging deployment only and must not be treated as the client production URL.
- Build/lint commands remain `npm run build` and `npm run lint`.
- Local execution was attempted from the agent runtime but outbound GitHub DNS/network access was unavailable, so local dependency installation and execution could not be completed in this cycle.
- Vercel preview validation is therefore the authoritative ephemeral QA gate for this cycle.

## Assumptions

- No production promotion is authorized by this cycle.
- Changes remain on the stabilization branch until preview and QA checks pass.
- Database-backed API tests require the configured environment and are not treated as a public-PMV smoke-test blocker.
