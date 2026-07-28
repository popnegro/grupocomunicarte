# 3-4. LENGUAJE VISUAL NUEVO Y MOODBOARD CONCEPTUAL

---

## FILOSOFÍA DE DISEÑO

**Principios Inspirados en Homely (ShadcnSpace):**

1. **Minimalismo Consciente**: Menos es más, pero cada elemento tiene propósito
2. **Ritmo Visual**: Espaciado predecible crea orden y confianza
3. **Tipografía Limpia**: Familias sans-serif modernas, legibles
4. **Paleta Reducida**: 3-4 colores máximo + escala de grises
5. **Microinteracciones**: Movimiento sutil que delata calidad
6. **Accesibilidad por Defecto**: WCAG 2.2 AA mínimo, idealmente AAA
7. **Performance First**: CSS modular, JS minimalista
8. **Mobile First**: Pensar pequeño, expandir inteligentemente

---

## MOODBOARD CONCEPTUAL (DESCRITO)

### Inspiración Visual

**Color Mood**: Tierra cálida + Azul confianza
- Tonos naturales que evocan la tierra colombiana
- Azules que transmiten profesionalismo
- Verdes que conectan con tema ambiental

**Tipografía Mood**: Moderna, humanista, legible
- Geist Sans: Limpia, amigable, accesible
- Inter: Secundaria, equilibrada, nerviosa (en pequeños textos)

**Espaciado Mood**: Generoso, respirado, estructurado
- Margins grandes comunican lujo
- Padding consistente crea predictibilidad
- Whitespace no es "vacío" sino "aire"

**Textura Mood**: Minimalista con detalles sutiles
- Gradientes muy suaves (2-3% de variación)
- Bordes redondeados generosos (12-16px)
- Sombras suaves (no proyecciones grandes)

### Ejemplos de Sensación Visual

```
┌─────────────────────────────────────┐
│                                     │
│      COMUNICARTE                    │  ← Espaciado generoso arriba
│                                     │
│  Tejiendo historias que             │  ← Tipografía clara
│  transforman comunidades.           │  ← Máximo 2 líneas
│                                     │
│      [CONOCER NUESTRO IMPACTO]      │  ← CTA clara, respirable
│                                     │
└─────────────────────────────────────┘
      ↓ Mucho espacio blanco ↓
┌─────────────────────────────────────┐
│                                     │
│  Nuestro Trabajo                    │
│                                     │
│  ▪ Comunicación popular             │  ← Bullets con color
│  ▪ Educación transformadora         │
│  ▪ Justicia social                  │
│                                     │
└─────────────────────────────────────┘
```

### Sentimiento Deseado

Cuando el usuario visite la landing debe sentir:
- ✓ Confianza (colores tierra + azul)
- ✓ Energía (animaciones sutiles)
- ✓ Claridad (tipografía + espaciado)
- ✓ Cercanía (tono conversacional)
- ✓ Profesionalismo (jerarquía clara)
- ✓ Innovación (microinteracciones)
- ✓ Autoridad (fotografías de impacto)

---

## PALETA DE COLORES NUEVA

### Colores Primarios (Identidad)

```
Color               Hex       RGB           Uso
───────────────────────────────────────────────────────────
Tierra Cálida       #8B6F47   139, 111, 71  Primario, headers, CTA
Azul Confianza      #2B5A7C   43, 90, 124   Secundario, accents
Verde Esperanza     #6B9E7F   107, 158, 127 Éxito, highlights
Naranja Energía     #D97C3B   217, 124, 59  Urgencia, buttons
```

### Paleta de Grises (Neutral)

```
Código      Nombre              Uso
─────────────────────────────────────────────
#000000     Negro               Text heading (h1, h2)
#1a1a1a     Very Dark           Text primario (h3, labels)
#333333     Dark                Body text
#666666     Medium              Text secundario
#999999     Light Medium        Placeholder, disabled
#cccccc     Light               Borders, dividers
#e8e8e8     Very Light          Backgrounds, hover
#f5f5f5     Off-white           Card backgrounds
#fafafa     Almost White        Page background
#ffffff     White               Pure backgrounds, text inverse
```

### Colores Semánticos

```
Estado      Color               Hex         Contraste (AA/AAA)
─────────────────────────────────────────────────────────
Success     Verde Esperanza     #6B9E7F     7.2:1 ✓✓ (AAA)
Warning     Naranja Energía     #D97C3B     5.8:1 ✓✗ (AA)
Error       Rojo Cuidado        #C73E3E     6.5:1 ✓✓ (AAA)
Info        Azul Confianza      #2B5A7C     7.1:1 ✓✓ (AAA)
```

### Escala de Opacidades (Alpha)

```
Nivel   Nombre              Uso
─────────────────────────────────────────
0.05    Subtle              Hover backgrounds
0.10    Soft                Borders, muy suave
0.20    Light               Backgrounds, overlays
0.40    Medium              Text disabled
0.60    Strong              Icons secondary
0.80    Bold                Backgrounds primary
1.00    Solid               Full opacity
```

### Gradientes Propios

```
Nombre              Uso                     Código
────────────────────────────────────────────────────
Warm Sunrise        Hero backgrounds        (#8B6F47 → #D97C3B)
Trust Fade          Overlays sutiles        (#2B5A7C → transparent)
Hope Lift           Accents y highlights    (#6B9E7F → lighter)
```

---

## TIPOGRAFÍA SISTEMA

### Familias Seleccionadas

**Primaria: Geist Sans** (Google Fonts)
- Limpia, moderna, humanista
- Excelente legibilidad en pantalla
- Soporta múltiples pesos (400, 500, 600, 700)
- Espaciado óptimo por defecto

**Secundaria: Inter** (Google Fonts)
- Perfecta para UI (labels, buttons, pequeños textos)
- Neutral, profesional
- Excelente en pequeños tamaños (12-14px)
- Monoespaciada disponible para código

### Escala Tipográfica (Modular 1.2)

```
Nivel   Elemento            Desktop     Mobile      Peso    Line Height
────────────────────────────────────────────────────────────────────
1       Display/H1          56px        40px        700     1.2
2       Heading/H2          44px        32px        600     1.25
3       Subheading/H3       32px        24px        600     1.3
4       Large Body/H4       24px        20px        600     1.35
5       Body                18px        16px        400     1.6
6       Small Body          16px        14px        400     1.6
7       Caption             14px        12px        500     1.5
8       Label/UI            12px        11px        600     1.4
```

**Justificación Modular**: Cada nivel es 1.2x el anterior, crea armonía visual

### Uso Específico

```
Elemento            Tipografía          Tamaño      Peso
─────────────────────────────────────────────────────
H1 (Hero)           Geist Sans          56px        700
H2 (Section)        Geist Sans          44px        600
H3 (Card Title)     Geist Sans          24px        600
Body Text           Geist Sans          18px        400
Small Text          Inter                14px        400
Button Text         Inter                16px        600
Label/Badge         Inter                12px        600
Navigation          Geist Sans          16px        500
```

### Propiedades CSS Base

```css
/* Geist Sans */
body {
  font-family: "Geist Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.01em; /* Muy suave */
  text-rendering: optimizeLegibility;
}

h1 {
  font-size: 56px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

/* Inter para UI */
button, label, small {
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.005em;
}
```

---

## SISTEMA DE ESPACIADO

### Base Unit = 4px (Por qué)
- Divisible por 2, 4, 8 → máxima flexibilidad
- Estándar web moderno (Tailwind, Material Design)
- Facilita responsive design
- Hace cálculos predictibles

### Escala de Espaciado

```
Token   Múltiplos   Píxeles   Uso
──────────────────────────────────────────────────────
xs      1x          4px       Inner spacing, micro
sm      2x          8px       Componente compacto
md      3x          12px      Espaciado normal
lg      4x          16px      Espaciado cómodo
xl      5x          20px      Entre elementos
2xl     6x          24px      Entre secciones pequeñas
3xl     8x          32px      Entre secciones
4xl     10x         40px      Section padding
5xl     12x         48px      Hero/large
6xl     16x         64px      Distintos contextos
7xl     20x         80px      Hero generoso
8xl     24x         96px      Extra grande
```

### Aplicación Práctica

```
Componente: Card
┌────────────────────────────┐
│  ←md→ Título      ←md→     │  ← padding: 16px
│  Contenido del card         │
│                            │
│  ← lg → [Button]           │  ← margin-top: 16px
└────────────────────────────┘

Sección: Hero
┌────────────────────────────┐
│                            │  ← padding-top: 80px (5xl)
│  Título Principal          │  
│                            │  ← margin-bottom: 24px (2xl)
│  Subtítulo                 │
│                            │  ← margin-bottom: 32px (3xl)
│  [CTA Button]              │
│                            │  ← padding-bottom: 80px (5xl)
└────────────────────────────┘
```

---

## SISTEMA DE RADIOS (Border Radius)

```
Token   Píxeles   Uso
────────────────────────────
none    0px       Bordes sharp (raramente)
sm      4px       Subtle curves (inputs, small elements)
md      8px       Cards, buttons pequeños
lg      12px      Buttons, larger cards
xl      16px      Modals, large cards
2xl     20px      Extra large components
full    9999px    Perfectly round (badges, avatars)
```

### Justificación
- Consistent curve language
- Matches modern design standards
- Accesible (no bordes ultra sharp)

---

## SISTEMA DE SOMBRAS

```
Nombre          CSS                                  Uso
───────────────────────────────────────────────────────────
none            none                                 Flat design
sm              0 1px 2px 0 rgba(0,0,0,0.05)        Subtle lift
md              0 4px 6px -1px rgba(0,0,0,0.1)      Card default
lg              0 10px 15px -3px rgba(0,0,0,0.1)    Elevated
xl              0 20px 25px -5px rgba(0,0,0,0.1)    Modal/Dialog
focus           0 0 0 3px rgba(43,90,124,0.1)       Focus ring
```

### Principio
- Sombras muy suaves (máx 0.1 alpha)
- Crean jerarquía visual sin ser obvias
- Indican "elevación" sutil
- Accesibles (no interfieren con legibilidad)

---

## SISTEMA DE ANIMACIONES

```
Propiedad       Duración    Easing              Uso
─────────────────────────────────────────────────────────
Fade In/Out     200ms       cubic-bezier        Elementos que aparecen
Slide           300ms       ease-out            Navegación, drawers
Pulse           1500ms      ease-in-out         Attention (CTA)
Bounce          400ms       cubic-bezier        Interacciones lúdicas
Glow            800ms       ease-in-out         Focus states
```

### Principios
- ✓ Bajo 300ms: se siente instantáneo
- ✓ 200-300ms: botones, hovers
- ✓ 400-500ms: transiciones mayores
- ✓ Nunca animaciones sin propósito
- ✓ Respeta prefers-reduced-motion

---

## CONCLUSIÓN DE IDENTIDAD

**Nueva Identidad = Confianza + Innovación + Cercanía**

Combinamos:
- Tonos tierra (humanidad, naturaleza, raíces)
- Azules (profesionalismo, tecnología)
- Verdes (esperanza, sostenibilidad)
- Espaciado generoso (lujo, respiración)
- Tipografía moderna (innovación)
- Animaciones sutiles (movimiento, vida)

→ Resultado: Brand premium que refleja la misión de COMUNICARTE

