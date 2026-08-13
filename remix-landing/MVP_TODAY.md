# MVP TODAY — REGLA OPERATIVA

## Objetivo

Obtener un PMV funcional, demostrable y desplegable **hoy**.

> **Funciona → se prueba → se presenta → se mejora después.**

## 1. Menos iteraciones

Resolver cada problema en una intervención siempre que sea posible.
No repetir una misma auditoría o refactor sin evidencia nueva.

## 2. Menos complejidad

Preferir la solución más simple que mantenga:

- funcionalidad
- seguridad
- consistencia visual
- mantenibilidad básica

No introducir arquitectura nueva para resolver problemas puntuales.

## 3. Menos documentación

Mantener solamente los documentos necesarios para operar el proyecto:

- `DESIGN.md` — contrato visual/UX.
- `PROJECT_ARCHITECTURE.md` — arquitectura vigente.
- `MVP_TODAY.md` — alcance, estado y criterios de aceptación.
- `HANDOFF.md` — solo cuando sea necesario transferir continuidad.

No crear un `.md` por cada bug, prompt, fase, ajuste visual o commit.

## 4. Una sola fuente de trabajo

La rama operativa es:

```text
audit/ux-ui-remix
```

Los backups y stashes sirven para proteger trabajo local, no para crear múltiples fuentes de verdad.

## 5. Automatizar primero

Cuando una tarea pueda resolverse con un script o comando reproducible, usar esa opción antes que instrucciones de edición manual.

Prioridades:

```text
script → validación → resultado
```

## 6. Criterio de decisión

Preguntar:

> ¿Esto bloquea el flujo principal del PMV?

Si **no**, enviar a backlog.

Si **sí**, resolver ahora con el cambio mínimo seguro.

## 7. Flujo principal del PMV

El recorrido que debe funcionar hoy es:

```text
Landing
  ↓
Explorar soportes
  ↓
Ver soporte
  ↓
Agregar soporte
  ↓
Contador de selección
  ↓
Solicitar cotización
  ↓
Media Kit
  ↓
Seleccionar soportes
  ↓
Fechas
  ↓
B2B / B2C
  ↓
Previsualizar
  ↓
Guardar
  ↓
Exportar PDF / PPTX
```

Flujo administrativo mínimo:

```text
Login
  ↓
Dashboard
  ↓
Soportes CRUD
  ↓
Destacados
  ↓
Preview
  ↓
Leads
  ↓
Media Kits
  ↓
Historial
```

## 8. Loading UX

Nunca confundir:

```text
loading ≠ empty ≠ error
```

Cuando la espera sea visible, usar skeleton con la misma estructura aproximada del contenido final.

No mostrar `0 registros` o columnas vacías mientras la consulta todavía está pendiente.

## 9. QA

Cada bloque debe cerrar con:

```bash
npm run lint
npm run build
```

Después realizar una prueba funcional concreta.

Si pasa: continuar.

Si falla: corregir el problema y volver a validar una vez.

## 10. Seguridad

Seguridad es bloqueo cuando existe un riesgo real:

- secretos expuestos
- autenticación rota
- autorización ausente
- entrada sensible sin validación
- vulnerabilidades críticas conocidas

No usar seguridad como excusa para una reescritura innecesaria.

## 11. Diseño

Para el PMV:

```text
consistencia > innovación
usabilidad > ornamentación
claridad > complejidad
```

## 12. Fuera del alcance inmediato

No bloquear el PMV por:

- optimización extrema del bundle
- migraciones tecnológicas grandes
- nuevas integraciones
- refactors arquitectónicos amplios
- nuevas features no críticas
- perfeccionamiento visual no bloqueante

Registrar en backlog y continuar.

## 13. Definición de terminado

Un bloque está terminado cuando:

```text
✓ funciona
✓ compila
✓ es usable
✓ no tiene errores críticos
```

No necesita estar perfecto.

## Regla final

> **No agregar complejidad para resolver problemas que todavía no existen.**
>
> **No documentar por documentar.**
>
> **No iterar por iterar.**
>
> **Cerrar el flujo principal y obtener el PMV hoy.**
