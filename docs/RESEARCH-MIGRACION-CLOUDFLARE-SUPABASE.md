# Research: migración a Cloudflare + Supabase

**Estado:** PAUSADO — investigación/documentación solamente  
**Rama base:** `feat/fase-02-ubicaciones-destacadas`  
**Rama de research:** `research/migracion-cloudflare-supabase`  
**Fecha:** 2026-08-10

## 1. Objetivo

Evaluar la migración de Grupo Comunicarte desde Vercel/Neon/Firebase hacia una arquitectura de menor costo operativo basada en:

- GitHub como repositorio y CI/CD.
- Cloudflare Pages para el frontend React/Vite.
- Cloudflare Workers como destino potencial del backend/API.
- Supabase como PostgreSQL + Auth + Storage.
- Resend para email transaccional.

**No implementar la migración en esta rama.** Esta rama queda como snapshot documental para retomar el trabajo posteriormente.

## 2. Diagnóstico actual

La rama base utiliza una aplicación React + Vite + TypeScript + Tailwind y un backend Node/Express.

El frontend genera `dist/` mediante Vite, por lo que su despliegue en Cloudflare Pages es conceptualmente directo.

El backend actual contiene endpoints `/api/*` y depende de Node/Express, Drizzle, PostgreSQL/Neon, Firebase Admin y Resend. Por lo tanto, la migración completa no es un simple cambio de hosting.

### Persistencia actual

`src/db/index.ts` define PostgreSQL/Neon como fuente única de persistencia y exige `DATABASE_URL`; no existe fallback productivo a memoria/mock.

Esto favorece una futura migración Neon → Supabase porque ambos utilizan PostgreSQL y Drizzle puede conservarse.

### Firebase actual

Existe integración con Firebase Admin para Auth/Firestore y variables de servicio (`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `FIREBASE_PROJECT_ID`). También hay sincronización de leads hacia Firestore.

La recomendación de arquitectura futura es consolidar autenticación y persistencia en Supabase y retirar progresivamente Firebase/Firestore, pero **no hacerlo como parte de esta rama**.

## 3. Arquitectura objetivo propuesta

```text
                         GitHub
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        Cloudflare Pages       Cloudflare Workers
                 │                     │
                 ▼                     ▼
             React/Vite                API
                                        │
                              ┌─────────┴─────────┐
                              ▼                   ▼
                         Supabase             Resend
                     ┌────────┼────────┐
                     ▼        ▼        ▼
                   Auth   PostgreSQL Storage
```

## 4. Estrategia de migración recomendada

No migrar todo simultáneamente.

### Fase A — frontend

1. Crear proyecto Cloudflare Pages conectado al repositorio GitHub.
2. Configurar build de Vite y directorio `dist`.
3. Configurar variables públicas necesarias.
4. Configurar dominio y DNS cuando corresponda.
5. Verificar rutas SPA y fallback.
6. Comparar visual y funcionalmente contra Vercel.

**Riesgo:** bajo.

### Fase B — PostgreSQL

1. Crear proyecto Supabase.
2. Revisar schema/migrations de Drizzle.
3. Migrar datos de Neon a Supabase.
4. Sustituir la conexión Neon por una conexión PostgreSQL compatible.
5. Ejecutar build, typecheck y pruebas.
6. Validar todas las operaciones CRUD.

**Riesgo:** bajo/medio.

### Fase C — autenticación

Evaluar migración Firebase Auth → Supabase Auth.

Antes de implementarla se debe inventariar:

- proveedores de login;
- roles;
- claims;
- sesiones;
- recuperación de contraseña;
- protección de rutas;
- dependencias de Firebase Admin.

**Riesgo:** medio.

### Fase D — Firestore

Eliminar progresivamente Firestore como almacenamiento paralelo de leads y establecer PostgreSQL/Supabase como fuente única.

Antes de eliminarlo se debe verificar que ningún flujo productivo dependa de Firestore.

**Riesgo:** medio.

### Fase E — backend

Evaluar Express → Cloudflare Workers.

No debe hacerse una traducción mecánica de `server.ts`. Primero hay que separar:

- routing;
- autenticación;
- servicios;
- repositorios;
- acceso a DB;
- email;
- integraciones externas;
- middleware específico de Node.

Después se decide qué endpoints pasan a Workers y cuáles conviene mantener en un runtime Node compatible.

**Riesgo:** medio/alto.

## 5. Principales blockers detectados

### No hay blocker arquitectónico

La migración es viable.

### Riesgos reales

1. **Backend Express/Node:** es el principal componente que impide una migración frontend-only completa.
2. **Firebase Admin:** requiere estrategia antes de eliminar Firebase.
3. **Firestore:** existe una segunda vía de persistencia que debe cerrarse correctamente.
4. **Variables de entorno:** deben mapearse cuidadosamente entre plataformas.
5. **SPA routing:** Cloudflare Pages debe configurarse para que React Router funcione correctamente.
6. **Compatibilidad de runtime:** algunas dependencias Node pueden requerir adaptación antes de Workers.
7. **Migración de datos:** debe hacerse con backup y validación antes del cutover.

## 6. Qué NO hacer al retomar

- No reemplazar Vercel, Neon y Firebase simultáneamente.
- No reescribir `server.ts` sin separar responsabilidades.
- No eliminar Firestore antes de confirmar que PostgreSQL cubre todos los casos de uso.
- No cambiar el modelo de datos solo por cambiar de proveedor.
- No mezclar la migración de infraestructura con nuevas funcionalidades de Fase 02.
- No convertir esta rama en una rama de desarrollo activo.

## 7. Secuencia recomendada al reactivar

```text
feat/fase-02-ubicaciones-destacadas
                │
                ▼
     estabilizar build/tests
                │
                ▼
      migración frontend
                │
                ▼
       Neon → Supabase
                │
                ▼
    Firebase → Supabase Auth
                │
                ▼
      retirar Firestore
                │
                ▼
    evaluar Express → Workers
```

## 8. Criterios de aceptación para la futura migración

### Frontend

- [ ] Build reproducible desde GitHub.
- [ ] `dist` servido correctamente.
- [ ] Todas las rutas SPA funcionan mediante refresh directo.
- [ ] Assets y sourcemaps correctos.
- [ ] Variables de entorno separadas por entorno.

### Base de datos

- [ ] Schema de Supabase validado.
- [ ] Datos migrados y reconciliados.
- [ ] CRUD de pantallas/ubicaciones/leads validado.
- [ ] No existe fallback mock/in-memory productivo.
- [ ] Backups disponibles antes del cutover.

### Auth

- [ ] Login funcional.
- [ ] Roles equivalentes.
- [ ] Protección de rutas validada.
- [ ] Recuperación de contraseña validada.

### API

- [ ] Todos los endpoints documentados.
- [ ] Autenticación/autorización validada.
- [ ] CORS validado.
- [ ] Errores HTTP normalizados.
- [ ] Integraciones externas verificadas.

## 9. Decisión actual

**PAUSAR.**

Esta rama contiene únicamente la documentación de investigación y no debe utilizarse para continuar el desarrollo funcional de Fase 02.

La rama funcional de referencia continúa siendo:

`feat/fase-02-ubicaciones-destacadas`

Cuando se retome la migración, crear una nueva rama de implementación a partir de la rama funcional estable, no continuar desarrollando producto sobre esta rama de research.
