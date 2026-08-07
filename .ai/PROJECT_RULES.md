# PROJECT RULES
## PMV Production Development Standards

**Version:** 1.0  
**Status:** Active  
**Purpose:** Development governance for AI-assisted and human development workflows.

---

# 1. PROJECT OBJECTIVE

Este proyecto debe mantenerse como un **Producto Mínimo Viable (PMV) listo para producción**.

La prioridad principal es:

1. Estabilidad.
2. Código limpio.
3. Arquitectura consistente.
4. Experiencia de usuario correcta.
5. Seguridad.
6. Performance.
7. Facilidad de mantenimiento.

No se prioriza:

- cantidad de código generado;
- cantidad de archivos creados;
- refactorizaciones constantes.

Se prioriza:

> Menos cambios, mejor calidad, mayor estabilidad.

---

# 2. DEVELOPMENT MODE

Todas las tareas deben ejecutarse bajo el siguiente criterio:

## AUTOMATE MODE

El agente debe:

1. Analizar antes de modificar.
2. Entender la arquitectura existente.
3. Identificar dependencias.
4. Aplicar cambios completos.
5. Ejecutar validaciones.
6. Entregar una solución estable.

No realizar implementaciones parciales.

---

# 3. CHANGE MANAGEMENT POLICY

Antes de modificar cualquier archivo responder:

- ¿Existe un problema real?
- ¿Afecta al PMV?
- ¿Mejora estabilidad?
- ¿Reduce complejidad?
- ¿Elimina deuda técnica?

Si la respuesta es negativa:

**No modificar.**

---

# 4. REFACTORING POLICY

## Objetivo

Crear código limpio y estable.

No realizar ciclos infinitos de refactorización.

---

## Un módulo queda finalizado cuando:

✅ Compila correctamente.  
✅ Pasa TypeScript.  
✅ Pasa ESLint.  
✅ Funciona correctamente.  
✅ Tiene responsabilidad única.  
✅ No contiene duplicación.  
✅ Está preparado para producción.

---

## Después de completar un módulo:

No modificar nuevamente salvo:

- bug confirmado;
- vulnerabilidad;
- incompatibilidad;
- error crítico.

---

# 5. ARCHITECTURE PRINCIPLES

Aplicar:

- KISS (Keep It Simple).
- DRY (Don't Repeat Yourself).
- SOLID cuando aporte valor.
- Separation of Concerns.
- Clean Architecture.

Evitar:

- sobreingeniería;
- abstracciones innecesarias;
- patrones complejos sin necesidad.

---

# 6. OFFICIAL TECHNOLOGY STACK

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React

---

## Backend

- Node.js
- Express
- API modular

---

## Database

- PostgreSQL
- Drizzle ORM

---

## Authentication

- Firebase Authentication

---

## Hosting

- Vercel

---

## Cloud Services

- Google Cloud
- Google Workspace APIs

---

# 7. ERROR HANDLING POLICY

Todo el proyecto debe utilizar una estrategia centralizada de errores.

---

# Frontend

Todos los módulos deben implementar:

- Loading State.
- Empty State.
- Error State.
- Retry Action.

Utilizar:

- Error Boundary.
- Toast notifications.

---

# Backend

Todas las respuestas API deben mantener formato consistente:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensaje para usuario"
  }
}
```

---

Nunca devolver:

- HTML desde APIs.
- Stack traces.
- Información sensible.
- Credenciales.

---

# 8. API CLIENT POLICY

Todas las llamadas HTTP deben pasar por:

```
apiClient.ts
```

No utilizar:

```javascript
fetch()
```

directamente dentro de componentes React.

---

Antes de procesar JSON:

Validar:

- HTTP Status.
- Content-Type.
- Respuesta válida.

Evitar:

```
Unexpected token '<'
```

cuando el servidor devuelve HTML.

---

# 9. GOOGLE SERVICES POLICY

Integraciones:

- Firebase Auth.
- Google OAuth.
- Google Drive API.
- Google Slides API.
- Google Picker.

---

Gestionar correctamente:

- OAuth expirado.
- permisos insuficientes.
- dominios no autorizados.
- APIs deshabilitadas.
- límites de cuota.

---

# 10. SECURITY RULES

Nunca almacenar:

- API Keys privadas.
- OAuth Secrets.
- Tokens.
- Passwords.

en:

- frontend;
- repositorio;
- archivos públicos.

Utilizar:

```
.env
Environment Variables
Secret Managers
```

---

# 11. CODE QUALITY

Eliminar:

- código muerto;
- imports sin uso;
- variables sin uso;
- componentes duplicados;
- servicios repetidos;
- hooks innecesarios;
- archivos abandonados.

---

Mantener:

- nombres consistentes;
- estructura clara;
- componentes pequeños;
- funciones simples.

---

# 12. VALIDATION PIPELINE

Antes de entregar cambios ejecutar:

```bash
npm run lint

npm run typecheck

npm run build
```

No entregar código con errores.

---

# 13. PRODUCTION READY STANDARD

El resultado final debe ser:

- estable;
- mantenible;
- seguro;
- escalable;
- documentado;
- desplegable.

El objetivo es generar un:

# Release Candidate

No un proyecto en constante modificación.