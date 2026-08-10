# GRUPO COMUNICARTE
# DESIGN.md
# LANDING UX/UI DESIGN CONTRACT
# GOOGLE STUDIO / STITCH
# BRANCH: feat/landing-studio

---

# 01. OBJETIVO

Este documento es el contrato de diseño para una única tarea:

REDISEÑAR EXCLUSIVAMENTE LA UX/UI DE LA LANDING PÚBLICA DE GRUPO COMUNICARTE.

La referencia funcional de partida es la rama:

`feat/fase-02-ubicaciones-destacadas`

La rama de trabajo para Google Studio es:

`feat/landing-studio`

El objetivo es mejorar:

- jerarquía visual
- composición
- navegación
- conversión
- claridad comercial
- arquitectura de información
- responsive
- accesibilidad
- consistencia visual
- percepción de producto profesional

NO es objetivo de esta tarea rediseñar ni modificar el Dashboard.

---

# 02. REGLA PRINCIPAL — UX/UI ONLY

Google Studio debe trabajar exclusivamente sobre la presentación y experiencia de la Landing.

SE PUEDE MODIFICAR:

- layout
- composición
- spacing
- tipografía dentro del sistema existente
- tamaños visuales
- jerarquía
- cards
- botones
- navegación visual
- Hero
- secciones de Landing
- grids
- responsive
- estados visuales
- microinteracciones sutiles
- accesibilidad visual
- orden visual del contenido existente cuando mejore claramente la UX

NO SE PUEDE MODIFICAR:

- API
- endpoints
- contratos de API
- autenticación
- Firebase
- Supabase
- base de datos
- modelos TypeScript
- entidades de negocio
- lógica comercial
- lógica de selección global
- persistencia
- reglas de disponibilidad
- routing existente
- URLs existentes
- variables de entorno
- configuración de Vercel
- configuración de build
- backend
- Dashboard
- permisos
- seguridad

NO crear funcionalidades de negocio nuevas para resolver un problema visual.

---

# 03. REGLA DE PRESERVACIÓN

ANTES DE CREAR:

1. Buscar componente existente.
2. Reutilizarlo si cumple.
3. Adaptarlo si es necesario.
4. Crear un componente nuevo únicamente si no existe una alternativa razonable.

NO duplicar componentes.

NO duplicar lógica.

NO duplicar datos.

NO reemplazar una implementación funcional únicamente porque otra parezca visualmente más moderna.

La implementación existente es la fuente de verdad funcional.

---

# 04. SCOPE EXACTO

EL SCOPE ES:

LANDING PÚBLICA.

Incluye únicamente la experiencia comercial pública que conduce al usuario hacia la exploración de soportes y solicitud de Media Kit.

Áreas objetivo:

1. Navbar
2. Hero
3. Propuesta de valor
4. Ubicaciones Destacadas
5. Explorador de Soportes cuando sea parte de la experiencia pública
6. Cobertura
7. CTA Media Kit
8. Footer
9. Estados visuales relacionados con estas áreas
10. Responsive de estas áreas

NO rediseñar:

- Dashboard
- pantallas administrativas
- autenticación
- gestión de soportes
- Leads
- Media Kits administrativos
- configuración
- backend

---

# 05. REFERENCIA DE DISEÑO

Utilizar como referencia visual:

https://shadcnspace.com/templates/preview/homely-nextjs

Homely sirve únicamente como referencia de:

- ritmo visual
- composición
- spacing
- jerarquía
- navegación
- Hero
- cards
- grids
- CTAs
- equilibrio entre imagen y contenido
- experiencia comercial
- responsive

NO copiar:

- branding
- logo
- colores
- textos
- imágenes
- contenido inmobiliario
- identidad inmobiliaria
- componentes específicos que no correspondan al producto
- estructura comercial de Homely

La referencia externa nunca tiene prioridad sobre este documento ni sobre el código existente.

---

# 06. IDENTIDAD DE MARCA

Marca:

GRUPO COMUNICARTE

La Landing debe transmitir:

- profesionalismo
- confianza
- cobertura territorial
- tecnología
- publicidad exterior
- capacidad comercial
- claridad
- solidez

La estética debe sentirse como una plataforma comercial profesional de publicidad exterior, no como una plantilla genérica.

Evitar:

- estética inmobiliaria
- estética fintech
- estética SaaS genérica
- cyberpunk
- neon
- dark-tech
- exceso de gradientes
- exceso de glassmorphism
- exceso de efectos decorativos

---

# 07. LIGHT THEME OBLIGATORIO

La Landing debe utilizar LIGHT THEME.

Preferir:

- blanco
- gris muy claro
- neutrales claros
- superficies limpias
- texto oscuro
- verde de marca como acento

NO utilizar como lenguaje principal:

- fondos negros
- cards negras
- dark mode
- superficies oscuras
- neon
- cyberpunk

Si una referencia externa utiliza dark mode, conservar únicamente su estructura o jerarquía útil y adaptar todo a Light Theme.

---

# 08. LOGO OFICIAL

El logo oficial es:

`gc-brand.png`

UTILIZAR EXACTAMENTE ESTE ASSET.

NO:

- recrear el logo
- redibujarlo
- escribir el nombre como sustituto visual
- generar un wordmark alternativo
- utilizar un logo generado por IA
- deformarlo
- alterar sus proporciones
- añadir fondos innecesarios

Conservar transparencia, proporción e identidad.

---

# 09. TIPOGRAFÍA

Prioridad:

1. Geist
2. Inter
3. JetBrains Mono para datos técnicos o metadata

NO incorporar nuevas familias tipográficas.

La tipografía principal debe favorecer:

- legibilidad
- jerarquía
- percepción premium
- lectura rápida
- claridad comercial

---

# 10. COLOR

Utilizar el sistema cromático existente del proyecto.

El verde de marca funciona como color de acción.

Usarlo para:

- CTA principal
- enlaces activos
- selección
- estados positivos
- indicadores relevantes
- acentos de marca

NO convertir toda la interfaz en verde.

El color debe establecer jerarquía, no decorar.

---

# 11. PRINCIPIO VISUAL

MENOS ES MÁS.

Prioridades:

1. claridad
2. jerarquía
3. legibilidad
4. conversión
5. confianza
6. consistencia

Evitar:

- ruido visual
- información repetida
- exceso de badges
- exceso de sombras
- exceso de bordes
- exceso de colores
- exceso de iconos
- overlays innecesarios
- animaciones decorativas
- elementos flotantes sin función

Cada elemento debe responder a una necesidad de UX.

---

# 12. ARQUITECTURA DE INFORMACIÓN

La Landing debe guiar al usuario mediante este recorrido:

DESCUBRIR
↓
ENTENDER
↓
EXPLORAR
↓
CONOCER UN SOPORTE
↓
UBICARLO
↓
SELECCIONARLO
↓
SOLICITAR MEDIA KIT

No introducir fricción innecesaria entre estas etapas.

---

# 13. JERARQUÍA DE LA LANDING

Orden visual recomendado:

1. Navbar
2. Hero
3. Propuesta de valor
4. Ubicaciones Destacadas
5. Explorador / acceso a soportes
6. Cobertura
7. CTA Media Kit
8. Footer

NO agregar nuevas secciones de negocio.

Si una sección existente necesita una mejor composición, rediseñarla sin alterar su propósito funcional.

---

# 14. NAVBAR

Debe comunicar inmediatamente:

- identidad
- navegación
- acceso a la acción comercial principal

Desktop:

- logo oficial
- navegación horizontal
- CTA principal claramente identificado

Mobile:

- logo
- menú compacto
- navegación accesible
- CTA accesible sin saturar la cabecera

La navegación debe ser simple y predecible.

NO introducir megamenús.

NO introducir navegación secundaria innecesaria.

---

# 15. HERO

El Hero es el principal punto de conversión y debe explicar rápidamente qué ofrece Grupo Comunicarte.

Debe contener:

- headline claro
- supporting copy breve
- CTA principal
- soporte visual relevante

La propuesta debe responder visualmente:

¿QUÉ OFRECE?
¿DÓNDE ESTÁ?
¿POR QUÉ ES RELEVANTE?
¿QUÉ PUEDO HACER AHORA?

Evitar:

- titulares genéricos
- párrafos largos
- múltiples CTAs con igual peso
- hero excesivamente alto
- decoración sin función

El CTA primario debe tener mayor jerarquía que cualquier acción secundaria.

---

# 16. PROPUESTA DE VALOR

Debe transformar características en beneficios comerciales.

Priorizar conceptos como:

- cobertura
- visibilidad
- ubicación estratégica
- formatos
- disponibilidad
- capacidad de planificación

Utilizar bloques breves y escaneables.

No convertir esta sección en una lista extensa de características técnicas.

---

# 17. UBICACIONES DESTACADAS

Es una sección comercial de descubrimiento.

Debe presentar una selección reducida y atractiva de soportes.

Objetivo UX:

captar interés → mostrar contexto → permitir explorar.

Recomendación visual:

4–6 soportes visibles en desktop cuando el contenido disponible lo permita.

No presentar esta sección como el catálogo completo.

No hardcodear contenido nuevo.

Los datos existentes deben continuar siendo la fuente funcional.

---

# 18. CARD DE SOPORTE

La card debe funcionar como resumen comercial.

Jerarquía recomendada:

1. imagen
2. nombre
3. ubicación
4. formato
5. disponibilidad
6. acciones

Debe existir una jerarquía clara entre información primaria y metadata.

Evitar cards sobrecargadas.

Evitar textos largos.

Evitar cinco o más acciones en una card.

Acciones existentes deben conservar su significado funcional, especialmente:

- Ver detalle
- Ubicar en el mapa

NO agregar una acción comercial nueva únicamente por diseño.

---

# 19. IMÁGENES

Las imágenes deben ser protagonistas cuando aporten información comercial.

Priorizar:

- proporciones consistentes
- recortes controlados
- buena relación imagen/contenido
- carga visual equilibrada

Evitar:

- imágenes distorsionadas
- crops arbitrarios
- imágenes decorativas sin relación con el soporte
- overlays que oculten información relevante

NO inventar imágenes de soportes que no existan.

---

# 20. DISPONIBILIDAD

Los estados existentes deben conservar su significado.

Estados principales:

- DISPONIBLE
- EN RESERVA

EN RESERVA:

- permanece visible
- puede consultarse
- debe verse claramente como estado distinto
- no debe parecer un error

Usar color, iconografía y texto de manera conjunta.

NO depender únicamente del color.

---

# 21. DETALLE Y SELECCIÓN

Cuando la Landing muestre acceso a detalle o selección, preservar el flujo funcional existente:

CARD
↓
VER DETALLE
↓
AGREGAR AL MEDIA KIT
↓
SELECCIONADO

La UI puede mejorar la claridad del flujo, pero NO cambiar su lógica.

El estado seleccionado debe ser inequívoco y sutil.

Preferir:

- check
- borde
- estado activo
- CTA actualizado

Evitar:

- card completamente verde
- overlays grandes
- animaciones excesivas

---

# 22. INDICADOR DE MEDIA KIT

Cuando existan soportes seleccionados, el usuario debe poder reconocer fácilmente que existe una selección global.

La UI puede mostrar un indicador como:

"3 soportes seleccionados"

junto con:

"Ver Media Kit"

Debe permanecer visible sin convertirse en un elemento invasivo.

NO crear una segunda selección local.

NO modificar la persistencia existente.

---

# 23. EXPLORADOR

Cuando forme parte de la Landing pública, el Explorador debe facilitar:

- descubrimiento
- búsqueda visual
- ubicación
- comparación
- acceso al detalle

La interfaz debe mantener el contexto del usuario.

Evitar que el usuario pierda su ubicación dentro del flujo.

Priorizar una relación clara entre:

LISTA ↔ MAPA ↔ DETALLE

---

# 24. MAPA

El mapa es una herramienta de ubicación, no un elemento decorativo.

Priorizar:

- legibilidad
- puntos GPS
- recorridos
- contexto geográfico
- selección activa

LEDMÓVIL debe representarse como recorrido/trayecto cuando corresponda.

NO convertir recorridos en una colección visualmente confusa de puntos.

---

# 25. CTA MEDIA KIT

El CTA final debe funcionar como cierre comercial de la Landing.

Debe responder:

¿Qué hago si ya me interesa?

La sección debe tener:

- headline claro
- explicación breve
- acción principal

No agregar múltiples acciones con el mismo peso.

La CTA debe sentirse como continuación natural del recorrido, no como un banner aislado.

---

# 26. FOOTER

El Footer debe cerrar la experiencia sin competir con el CTA principal.

Priorizar:

- identidad
- navegación secundaria necesaria
- información institucional existente
- contacto existente

NO agregar enlaces ficticios.

NO inventar redes, direcciones, teléfonos o datos comerciales.

---

# 27. RESPONSIVE

NINGUNA MODIFICACIÓN ESTÁ TERMINADA SIN DESKTOP + MOBILE.

Mobile NO es Desktop reducido.

Debe adaptarse:

- navegación
- orden de contenido
- tamaños
- cards
- spacing
- CTAs
- imágenes
- formularios
- mapa

La prioridad en mobile es:

1. contenido esencial
2. acción principal
3. lectura rápida
4. navegación simple

---

# 28. BREAKPOINTS

Utilizar los breakpoints y patrones responsive existentes del proyecto.

NO introducir una arquitectura responsive paralela.

NO crear breakpoints arbitrarios si los existentes permiten resolver el diseño.

El resultado debe ser consistente con Tailwind y con la implementación actual.

---

# 29. TOUCH TARGETS

Todos los controles interactivos deben ser cómodos para touch.

Evitar:

- botones demasiado pequeños
- iconos aislados sin área táctil suficiente
- controles demasiado próximos
- navegación difícil de operar con una mano

---

# 30. ACCESIBILIDAD

Mantener como mínimo:

- contraste adecuado
- focus visible
- labels comprensibles
- jerarquía semántica
- navegación por teclado
- targets táctiles adecuados
- estados comprensibles sin depender únicamente del color
- textos alternativos cuando correspondan

No sacrificar accesibilidad por estética.

---

# 31. COMPONENTES

Preferir componentes existentes del proyecto.

Patrón obligatorio:

BUSCAR
↓
REUTILIZAR
↓
ADAPTAR
↓
CREAR SOLO SI ES NECESARIO

NO duplicar:

- botones
- cards
- badges
- modales
- headers
- layouts
- componentes de navegación

Si un componente existente necesita una variante visual, preferir una variante controlada antes que duplicarlo.

---

# 32. ICONOGRAFÍA

Utilizar la iconografía existente del proyecto.

Si se requieren iconos nuevos y el proyecto ya utiliza Lucide, mantener Lucide.

NO introducir múltiples familias de iconos.

Los iconos deben reforzar significado, no reemplazar texto esencial.

---

# 33. ANIMACIÓN

Utilizar motion únicamente cuando aporte:

- orientación
- feedback
- continuidad
- percepción de interacción

Preferir animaciones cortas y discretas.

NO utilizar:

- parallax excesivo
- entradas permanentes
- efectos de rebote
- animaciones que retrasen la acción
- movimiento decorativo constante

La interacción debe sentirse rápida.

---

# 34. ESTADOS UI

Considerar visualmente:

- default
- hover
- focus
- active
- selected
- disabled
- loading
- empty
- error

No crear estados funcionales nuevos; diseñar únicamente la presentación de los estados que ya existen o que sean necesarios para una interfaz completa.

---

# 35. EMPTY / LOADING / ERROR

Toda zona dinámica visible debe tener una representación comprensible cuando corresponda.

EMPTY:

- explicar el contexto
- evitar pantallas vacías sin significado

LOADING:

- feedback claro
- no bloquear innecesariamente toda la Landing

ERROR:

- mensaje comprensible
- acción de recuperación cuando exista

No inventar lógica de recuperación nueva.

---

# 36. CONTENIDO

NO inventar:

- precios
- disponibilidad
- ubicaciones
- métricas
- estadísticas
- clientes
- testimonios
- logos de clientes
- certificaciones
- datos comerciales

Utilizar el contenido real existente.

Si falta contenido para una decisión visual, usar un placeholder claramente identificable únicamente durante el diseño y no dejarlo como contenido de producción.

---

# 37. DATOS Y LÓGICA

La fuente de datos existente debe permanecer intacta.

NO convertir datos dinámicos en contenido hardcodeado.

NO reemplazar datos reales por mocks.

NO introducir inventarios paralelos.

NO crear arrays de soportes únicamente para resolver la presentación.

La UI debe adaptarse a los datos existentes.

---

# 38. ROUTING

NO cambiar rutas existentes.

NO migrar BrowserRouter/HashRouter.

NO crear nuevas rutas para resolver un cambio puramente visual.

Si una pantalla ya tiene una ruta funcional, conservarla.

---

# 39. API / BACKEND

NO modificar:

- endpoints
- fetchers
- contratos
- payloads
- validaciones de backend
- autenticación
- autorización
- base de datos

Si una limitación del backend afecta la presentación, adaptar la UI sin alterar el contrato.

---

# 40. DEPENDENCIAS

NO agregar dependencias nuevas salvo necesidad técnica excepcional y explícitamente autorizada.

Preferir:

- React existente
- Tailwind existente
- componentes existentes
- Lucide existente

No introducir otra librería de UI para resolver una necesidad visual.

---

# 41. ARCHIVOS PROTEGIDOS

Tratar como protegidos salvo instrucción explícita:

- API
- backend
- autenticación
- configuración de Firebase
- configuración de Supabase
- modelos de datos
- tipos de dominio
- variables de entorno
- configuración de Vercel
- configuración de build
- Dashboard
- lógica comercial

La modificación debe concentrarse en componentes y estilos de la Landing.

---

# 42. NO REDISEÑAR EL DASHBOARD

Esta iteración NO incluye Dashboard.

NO modificar:

- sidebar administrativo
- header administrativo
- tablas administrativas
- formularios administrativos
- vistas de Leads
- vistas de Media Kits
- gestión de soportes
- Inicio del Dashboard

Si un componente es compartido por Landing y Dashboard, modificarlo únicamente si la modificación mantiene compatibilidad y es estrictamente necesaria para la Landing.

---

# 43. NO CAMBIAR EL DESIGN SYSTEM GLOBAL

No redefinir globalmente colores, tokens, spacing o tipografía si el cambio solo es necesario para una sección.

Preferir ajustes locales y coherentes.

Si se detecta una mejora global realmente necesaria, documentarla como propuesta y NO aplicarla automáticamente.

---

# 44. CRITERIO DE CALIDAD VISUAL

La Landing final debe sentirse:

- premium
- clara
- moderna
- comercial
- confiable
- tecnológica sin ser fría
- visualmente ordenada
- rápida de entender

Debe evitar sentirse:

- genérica
- recargada
- amateur
- inmobiliaria
- excesivamente corporativa
- experimental sin propósito

---

# 45. CRITERIO DE CONVERSIÓN

Cada sección debe tener una función dentro del recorrido comercial.

Preguntar visualmente:

¿El usuario entiende qué ofrecemos?
¿Entiende dónde estamos?
¿Puede descubrir soportes?
¿Puede conocer un soporte?
¿Puede ubicarlo?
¿Puede seleccionarlo?
¿Entiende cómo solicitar el Media Kit?

Reducir fricción antes de agregar elementos.

---

# 46. REGLA DE CAMBIO

Cuando se solicite una modificación concreta:

1. identificar la pantalla
2. identificar el componente
3. preservar la lógica
4. modificar la presentación
5. comprobar desktop
6. comprobar mobile
7. comprobar estados
8. comprobar accesibilidad

NO aprovechar una modificación pequeña para rediseñar toda la aplicación.

---

# 47. VALIDACIÓN ANTES DE FINALIZAR

Antes de considerar terminado el trabajo:

- revisar todos los cambios del diff
- comprobar que solo afectan Landing/UI
- ejecutar TypeScript
- ejecutar build
- verificar desktop
- verificar mobile
- verificar navegación existente
- verificar CTAs existentes
- verificar selección existente
- verificar Media Kit existente
- verificar que no se modificó Dashboard
- verificar que no se modificaron API/backend

Comandos esperados:

`npx tsc --noEmit`

`npm run build`

---

# 48. CRITERIO DE ACEPTACIÓN

ACEPTAR SOLO SI:

UX mejorada ✓
UI mejorada ✓
Landing exclusivamente ✓
Light Theme ✓
Logo oficial ✓
Componentes reutilizados ✓
Responsive desktop ✓
Responsive mobile ✓
Accesibilidad ✓
Lógica existente preservada ✓
Datos existentes preservados ✓
Rutas preservadas ✓
API preservada ✓
Dashboard preservado ✓
Build correcto ✓

---

# 49. INSTRUCCIÓN FINAL PARA GOOGLE STUDIO

REDISEÑA LA LANDING DE GRUPO COMUNICARTE UTILIZANDO ESTE DESIGN.md COMO CONTRATO.

Trabaja únicamente sobre UX/UI.

Usa la rama `feat/landing-studio` como espacio de trabajo.

Toma `feat/fase-02-ubicaciones-destacadas` como estado funcional de referencia.

Conserva toda la lógica existente.

Conserva todos los datos existentes.

Conserva las rutas existentes.

Conserva las APIs existentes.

Conserva la autenticación existente.

No modifiques el Dashboard.

No inventes contenido comercial.

No reemplaces datos reales por mocks.

No agregues nuevas funcionalidades de negocio.

No agregues nuevas dependencias salvo autorización explícita.

No cambies la identidad de Grupo Comunicarte.

No recrees el logo.

No copies literalmente Homely ni ninguna identidad externa.

PRIORIDAD:

1. funcionalidad existente
2. este DESIGN.md
3. assets existentes
4. componentes existentes
5. referencia visual Homely

Objetivo final:

UNA LANDING MÁS PROFESIONAL, MÁS CLARA, MÁS COMERCIAL Y MÁS CONVINCENTE, SIN ALTERAR EL NÚCLEO FUNCIONAL DEL PRODUCTO.
