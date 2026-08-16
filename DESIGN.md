# GRUPO COMUNICARTE
# DESIGN.md
# MASTER DESIGN CONTRACT
# PMV — LANDING + DASHBOARD
# LIGHT THEME
# DESKTOP + MOBILE

---

# 01. PROPÓSITO

Este documento es el CONTRATO MAESTRO
DE DISEÑO del proyecto Grupo Comunicarte.

Es la fuente principal de verdad para:

- identidad visual
- logo
- colores
- tipografía
- componentes
- UX
- navegación
- Landing
- Dashboard
- responsive
- estados
- soportes
- mapas
- Media Kit

Toda pantalla nueva DEBE respetar
este documento.

Toda modificación DEBE respetar
este documento.

NO reinterpretar libremente
las reglas establecidas aquí.

---

# 02. PRIORIDAD DE DECISIONES

Cuando exista una contradicción,
utilizar este orden:

1. DESIGN.md
2. Assets oficiales del proyecto
3. Reglas funcionales explícitas
4. Orden actual
5. Pantalla seleccionada
6. Referencias externas

Las referencias externas
NUNCA tienen prioridad sobre
este DESIGN.md.

---

# 03. ASSETS OFICIALES

## LOGO OFICIAL

El proyecto contiene el asset:

gc-brand.png

Este archivo es el LOGO OFICIAL
DE GRUPO COMUNICARTE.

Utilizar EXACTAMENTE este asset.

NO recrear el logo.

NO redibujar el logo.

NO escribir "GRUPO COMUNICARTE"
como sustituto del logo.

NO generar un logo nuevo.

NO utilizar un logo generado
por Stitch.

NO utilizar un wordmark inventado.

NO reemplazar el archivo
por texto estilizado.

NO modificar la identidad
del archivo.

---

## REGLA DE USO DEL LOGO

Cuando una pantalla requiera
el logo de Grupo Comunicarte:

UTILIZAR:

gc-brand.png

como imagen / asset.

El logo debe conservar:

- proporciones
- relación de aspecto
- identidad gráfica
- transparencia
- integridad visual

NO deformar.

NO estirar.

NO comprimir visualmente.

NO alterar sus proporciones.

---

## FONDO

El archivo gc-brand.png posee
transparencia.

Mantener la transparencia.

NO agregar automáticamente:

- caja blanca
- rectángulo
- fondo de color
- contenedor innecesario

El logo debe integrarse
sobre las superficies del
Design System.

---

## LOGO EN NAVBAR

La Navbar debe utilizar
gc-brand.png.

NO mostrar un texto simulando
el logo.

NO utilizar:

"GRUPO COMUNICARTE"

como sustituto gráfico.

El texto puede aparecer
como contenido cuando corresponda,
pero NO como reemplazo del logo.

---

## LOGO EN DASHBOARD

El Dashboard también debe
utilizar gc-brand.png.

Aplicar el mismo principio:

UN ASSET OFICIAL
+
DIFERENTES TAMAÑOS RESPONSIVE.

---

# 04. IDENTIDAD DE MARCA

Marca:

GRUPO COMUNICARTE

La identidad debe transmitir:

- profesionalismo
- confianza
- cobertura
- tecnología
- publicidad exterior
- capacidad comercial

La interfaz debe evitar
una estética excesivamente
corporativa o genérica.

---

# 05. LIGHT THEME

LIGHT THEME ES OBLIGATORIO.

Todo el proyecto debe diseñarse
en Light Theme.

NO utilizar:

- Dark Theme
- fondos negros
- cards negras
- sidebar negro
- superficies oscuras
- estética neon
- cyberpunk
- Tech-Noir

Si una referencia externa
utiliza Dark Theme:

IGNORAR EL TEMA OSCURO.

Utilizar únicamente:

- composición
- jerarquía
- estructura
- UX

---

# 06. PRINCIPIO VISUAL

## MENOS ES MÁS

Toda pantalla debe priorizar:

- claridad
- jerarquía
- simplicidad
- legibilidad
- consistencia

Evitar:

- ruido visual
- información duplicada
- badges innecesarios
- flotantes innecesarios
- overlays redundantes
- exceso de sombras
- exceso de colores
- exceso de bordes
- animaciones innecesarias

Cada elemento debe justificar
su existencia.

---

# 07. REFERENCIA LANDING

Referencia:

https://shadcnspace.com/templates/preview/homely-nextjs

Utilizar Homely como referencia
para:

- composición
- ritmo visual
- navegación
- Hero
- secciones
- cards
- grids
- spacing
- CTAs
- experiencia comercial
- responsive

NO copiar:

- branding
- logo
- colores
- imágenes
- textos
- contenido inmobiliario
- identidad inmobiliaria
- estructura de negocio

Homely es una referencia
VISUAL Y UX.

NO es una plantilla
para copiar literalmente.

---

# 08. REFERENCIA DASHBOARD

Referencia:

https://shadcnspace.com/blocks/dashboard-ui/dashboard-shell

Utilizar Dashboard Shell
como referencia estructural.

Priorizar:

- sidebar
- header
- navegación
- área principal
- jerarquía administrativa
- responsive

Preferir la variante
Modern Dashboard Shell.

NO copiar:

- contenido ficticio
- métricas de ejemplo
- branding
- colores
- módulos ajenos al producto

---

# 09. SISTEMA DE DISEÑO

Utilizar componentes
reutilizables.

REGLA:

BUSCAR
↓
REUTILIZAR
↓
ADAPTAR
↓
CREAR SOLO SI ES NECESARIO

NO crear componentes
duplicados.

NO crear variantes
innecesarias.

---

# 10. TIPOGRAFÍA

Prioridad:

- Geist
- Inter
- JetBrains Mono

No agregar nuevas familias
sin autorización explícita.

JetBrains Mono:

- datos técnicos
- metadata
- identificadores

NO utilizar JetBrains Mono
como tipografía principal.

---

# 11. COLOR

Utilizar el sistema cromático
de marca existente.

El verde de marca representa
la principal acción.

Utilizarlo para:

- CTA principal
- estados activos
- selección
- indicadores relevantes
- elementos de marca

NO utilizar verde excesivamente.

Fondos:

- blancos
- neutrales claros

Texto:

- oscuro
- alto contraste

---

# 12. RESPONSIVE

REGLA OBLIGATORIA:

NINGUNA PANTALLA ESTÁ TERMINADA
SIN:

DESKTOP
+
MOBILE

Toda pantalla nueva debe
contemplar ambas experiencias.

---

# 13. MOBILE

Mobile NO es Desktop reducido.

Mobile debe adaptar:

- navegación
- layout
- cards
- spacing
- formularios
- mapas
- tablas
- CTAs
- orden de contenido

Mantener:

- identidad
- jerarquía
- funcionalidades
- acciones

---

# 14. TOUCH

Todos los elementos interactivos
deben ser adecuados para touch.

Evitar:

- botones pequeños
- targets demasiado próximos
- controles difíciles de tocar

---

# 15. LANDING

La Landing es la experiencia
pública y comercial.

Debe permitir:

EXPLORAR
↓
CONOCER
↓
UBICAR
↓
SELECCIONAR
↓
SOLICITAR

---

# 16. LANDING — ESTRUCTURA

La Landing debe contemplar:

1. Navbar
2. Hero
3. Propuesta de valor
4. Ubicaciones Destacadas
5. Explorador de Soportes
6. Cobertura
7. CTA Media Kit
8. Footer

NO agregar nuevas secciones
sin una orden explícita.

---

# 17. NAVBAR

Debe contener:

- logo oficial gc-brand.png
- navegación
- CTA relevante

Desktop:

navegación horizontal.

Mobile:

navegación colapsada.

NO utilizar texto como
sustituto del logo.

---

# 18. HERO

Debe comunicar:

- qué ofrece Grupo Comunicarte
- cobertura
- tipos de soportes
- propuesta de valor

Debe existir:

Título
+
Descripción
+
CTA principal

Evitar múltiples CTAs
sin jerarquía.

---

# 19. UBICACIONES DESTACADAS

Presentar una selección
comercial reducida.

NO representa todo el catálogo.

El catálogo completo
pertenece al Explorador.

---

# 20. DESTACADOS — DATOS

Las Ubicaciones Destacadas
deben provenir de soportes
administrados desde el Dashboard.

NO hardcodear.

El Dashboard debe permitir
seleccionar cuáles son
destacados.

---

# 21. DESTACADOS — CANTIDAD

Recomendación:

4–6 soportes.

El catálogo completo
puede contener hasta 50.

---

# 22. CARD DE SOPORTE

Cada card debe mostrar:

- imagen
- nombre
- ubicación
- formato
- disponibilidad

CTAs:

[ Ver detalle ]

[ Ubicar en el mapa ]

NO agregar:

[ Solicitar Media Kit ]

directamente en la card.

---

# 23. VER DETALLE

Debe abrir el detalle
del soporte.

El detalle pertenece
al mismo sistema de soportes.

---

# 24. UBICAR EN EL MAPA

Debe llevar al Explorador
y ubicar el soporte.

GPS:

punto.

LEDMÓVIL:

recorrido.

NO mostrar LEDMÓVIL
como puntos aislados.

---

# 25. DETALLE DEL SOPORTE

Debe mostrar:

- imagen
- nombre
- ubicación
- formato
- disponibilidad
- información técnica
- información comercial

CTA:

[ Agregar al Media Kit ]

---

# 26. SELECCIÓN DE SOPORTES

Flujo:

CARD
↓
VER DETALLE
↓
AGREGAR AL MEDIA KIT
↓
SELECCIONADO

La selección es GLOBAL.

---

# 27. SELECCIÓN GLOBAL

La selección debe persistir
entre:

- destacados
- explorador
- mapa
- detalle
- Media Kit

NO crear selecciones
independientes.

---

# 28. ESTADO SELECCIONADO

Debe reconocerse claramente.

Utilizar:

- check
- borde
- estado activo
- CTA actualizado

Mantenerlo sutil.

NO utilizar:

- overlays grandes
- cards completamente verdes
- animaciones excesivas

---

# 29. INDICADOR GLOBAL

Cuando existan soportes:

mostrar:

"3 soportes seleccionados"

y:

[ Ver Media Kit ]

Debe ser visible
sin generar ruido.

---

# 30. EXPLORADOR

Puede contener hasta
50 soportes.

Debe priorizar:

- lista
- mapa
- ubicación
- detalle

---

# 31. EXPLORADOR — FLUJO

OBLIGATORIO:

LISTA
↓
SELECCIONAR SOPORTE
↓
DETALLE
↓
VOLVER

El detalle debe cargarse
dentro del mismo contexto
del Explorador.

---

# 32. MAPA

Priorizar:

- puntos GPS
- ubicaciones
- recorridos

NO cubrir el mapa
con información redundante.

---

# 33. LEDMÓVIL

LEDMÓVIL es un recorrido.

Representar como:

RUTA / TRAYECTO

NO como puntos GPS aislados.

---

# 34. DISPONIBILIDAD

Estados:

DISPONIBLE
EN RESERVA

EN RESERVA:

- permanece visible
- estado muted
- puede consultarse
- puede agregarse al Media Kit

NO ocultar.

---

# 35. MEDIA KIT — SIN SOPORTES

Mostrar:

- Nombre completo
- Empresa
- WhatsApp
- Email
- Mensaje
- Enviar

El usuario puede contactar
sin seleccionar soportes.

---

# 36. MEDIA KIT — CON SOPORTES

Mostrar:

- Nombre completo
- Empresa
- WhatsApp
- Email
- Pantallas seleccionadas
- Fechas de interés
- Enviar

---

# 37. FECHAS

Cuando existen soportes:

Fecha desde
Fecha hasta

Regla:

Fecha desde <= Fecha hasta

---

# 38. DASHBOARD

El Dashboard es una aplicación
administrativa.

Estructura:

SIDEBAR
+
HEADER
+
MAIN CONTENT

Utilizar Dashboard Shell
como referencia.

---

# 39. DASHBOARD — PMV

Módulos:

Inicio
Soportes
Leads
Media Kits

NO incluir:

Contenido
Integraciones

salvo orden explícita futura.

---

# 40. DASHBOARD — SOPORTES

Debe permitir:

- listar
- buscar
- visualizar
- editar
- disponibilidad
- destacar
- quitar destacado

---

# 41. DASHBOARD — DESTACADOS

Debe permitir seleccionar
qué soportes aparecen
en Ubicaciones Destacadas.

Quitar destacado
NO elimina soporte.

---

# 42. DASHBOARD — LEADS

Debe permitir visualizar:

- nombre
- empresa
- WhatsApp
- email
- soportes
- fechas
- mensaje
- fecha

---

# 43. DASHBOARD — MEDIA KITS

Debe permitir visualizar:

- contacto
- empresa
- WhatsApp
- email
- soportes
- fechas
- mensaje
- fecha de solicitud

---

# 44. DASHBOARD — MOBILE

Desktop:

sidebar.

Mobile:

drawer / navegación colapsada.

Mantener las mismas
funcionalidades.

---

# 45. FORMULARIOS

Utilizar:

- labels
- validación
- mensajes de error
- spacing
- CTA principal

Mobile:

una columna.

---

# 46. TABLAS

Priorizar:

- legibilidad
- estados
- búsqueda
- acciones

Mobile:

adaptar mediante:

- cards
- scroll horizontal
- filas responsive

---

# 47. EMPTY STATES

Cuando no existan datos:

mostrar:

- contexto
- explicación
- acción

Nunca mostrar
una pantalla vacía
sin explicación.

---

# 48. ACCESSIBILITY

Mantener:

- contraste
- focus
- labels
- teclado
- touch targets
- jerarquía semántica

No depender únicamente
del color.

---

# 49. NO DUPLICAR DATOS

Un soporte debe ser
una entidad única.

Utilizar la misma información
en:

- destacados
- explorador
- mapa
- detalle
- Media Kit
- Dashboard

---

# 50. NO DUPLICAR LÓGICA

Desktop y Mobile:

UNA MISMA LÓGICA
+
DOS PRESENTACIONES RESPONSIVE

---

# 51. NO DECISIONES ALEATORIAS

Si algo no está definido:

1. seguir DESIGN.md
2. utilizar asset existente
3. reutilizar componente
4. conservar patrón existente
5. elegir solución simple

NO inventar.

---

# 52. QUICK EDIT

Cuando se seleccione
una pantalla:

ESA PANTALLA ES LA BASE.

Modificar únicamente
lo solicitado.

NO rediseñar otras pantallas.

NO cambiar el Design System.

NO cambiar Light Theme.

NO cambiar navegación
sin autorización.

---

# 53. ALCANCE

El proyecto se construirá
en dos grandes fases.

FASE 1:

LANDING

FASE 2:

DASHBOARD

No generar ambas fases
simultáneamente.

---

# 54. ORDEN DE IMPLEMENTACIÓN

Landing:

01. Landing Base
02. Ubicaciones Destacadas
03. Explorador
04. Detalle + Selección
05. Media Kit
06. Páginas secundarias
07. Auditoría Responsive

Después:

Dashboard.

---

# 55. CRITERIO DE FINALIZACIÓN

Una pantalla está terminada
cuando cumple:

Desktop ✓
Mobile ✓
Light Theme ✓
Logo oficial ✓
Design System ✓
Responsive ✓
Accessibility ✓
Estados ✓
UX consistente ✓

---

# 56. PRINCIPIOS FINALES

LIGHT THEME.

MENOS ES MÁS.

LOGO OFICIAL = gc-brand.png.

NO RECREAR EL LOGO.

DESKTOP + MOBILE.

COMPONENTES REUTILIZABLES.

NO DUPLICAR DATOS.

NO DUPLICAR LÓGICA.

CARD = RESUMEN.

DETALLE = INFORMACIÓN COMPLETA.

MAPA = UBICACIÓN / RECORRIDO.

MEDIA KIT = SELECCIÓN + SOLICITUD.

DASHBOARD = ADMINISTRACIÓN.

HOMELY = REFERENCIA LANDING.

DASHBOARD SHELL = REFERENCIA DASHBOARD.

NO COPIAR IDENTIDADES EXTERNAS.

NO TOMAR DECISIONES AL AZAR.

CONSERVAR ANTES DE CREAR.

REUTILIZAR ANTES DE INVENTAR.

RESPONSIVE NO SIGNIFICA REDUCIR.

RESPONSIVE SIGNIFICA ADAPTAR.

EL ASSET OFICIAL SIEMPRE TIENE
PRIORIDAD SOBRE UNA RECREACIÓN VISUAL.