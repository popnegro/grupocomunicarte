# 5-9. SISTEMAS VISUALES - DESIGN TOKENS

**Formato JSON listo para Tailwind CSS y CSS Variables**

---

## 5. PALETA DE COLORES COMPLETA

### JSON Structure

```json
{
  "colors": {
    "primary": {
      "50": "#f5ede5",
      "100": "#e8d9ca",
      "200": "#d9bf95",
      "300": "#c9a560",
      "400": "#8B6F47",
      "500": "#7a5f3f",
      "600": "#6a5037",
      "700": "#5a402f",
      "800": "#4a3027",
      "900": "#3a201f"
    },
    "secondary": {
      "50": "#e3ecf2",
      "100": "#c7d9e5",
      "200": "#a4bccf",
      "300": "#7d9fb9",
      "400": "#2B5A7C",
      "500": "#254c6a",
      "600": "#1f4058",
      "700": "#193446",
      "800": "#132834",
      "900": "#0d1c22"
    },
    "success": {
      "50": "#e8f2ed",
      "100": "#cfe5db",
      "200": "#a8d3bb",
      "300": "#6B9E7F",
      "400": "#4d7a62",
      "500": "#2f564b",
      "600": "#1f3834",
      "700": "#0f1a17"
    },
    "warning": {
      "50": "#fde8dd",
      "100": "#fad1bb",
      "200": "#f5b08a",
      "300": "#D97C3B",
      "400": "#b85e25",
      "500": "#9a4a1a",
      "600": "#7a360f",
      "700": "#5a2204"
    },
    "error": {
      "50": "#fde8e8",
      "100": "#fad1d1",
      "200": "#f5a3a3",
      "300": "#C73E3E",
      "400": "#ad2f2f",
      "500": "#932020",
      "600": "#791111"
    },
    "gray": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#e8e8e8",
      "300": "#cccccc",
      "400": "#999999",
      "500": "#666666",
      "600": "#333333",
      "700": "#1a1a1a",
      "800": "#000000"
    }
  }
}
```

### CSS Variables (para root)

```css
:root {
  /* Primarios */
  --color-primary-400: #8B6F47;
  --color-primary-500: #7a5f3f;
  --color-primary-600: #6a5037;
  
  /* Secundarios */
  --color-secondary-400: #2B5A7C;
  --color-secondary-500: #254c6a;
  
  /* Semánticos */
  --color-success: #6B9E7F;
  --color-warning: #D97C3B;
  --color-error: #C73E3E;
  
  /* Grays */
  --color-text-primary: #000000;
  --color-text-secondary: #333333;
  --color-text-tertiary: #666666;
  --color-border: #cccccc;
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
}
```

### Tailwind Config Extract

```javascript
module.exports = {
  theme: {
    colors: {
      primary: {
        50: '#f5ede5',
        // ... completo en archivo tema
        400: '#8B6F47',
      },
      secondary: {
        400: '#2B5A7C',
      },
      success: '#6B9E7F',
      warning: '#D97C3B',
      error: '#C73E3E',
    },
  },
}
```

---

## 6. TIPOGRAFÍA SISTEMA

### Familias y Imports

```css
@import url('https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: "Geist Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-ui: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### Escala Tipográfica (CSS)

```css
/* Display / H1 */
.h1, h1 {
  font-size: 56px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
}

/* Heading / H2 */
.h2, h2 {
  font-size: 44px;
  line-height: 1.25;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
}

/* Subheading / H3 */
.h3, h3 {
  font-size: 32px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.005em;
  margin-bottom: 0.75rem;
  font-family: var(--font-sans);
}

/* Large / H4 */
.h4, h4 {
  font-size: 24px;
  line-height: 1.35;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-family: var(--font-sans);
}

/* Body */
.body, body, p {
  font-size: 18px;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.01em;
  font-family: var(--font-sans);
}

/* Small Body */
.small {
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  font-family: var(--font-sans);
}

/* Caption */
.caption {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-family: var(--font-ui);
}

/* Label / UI */
.label, label, .badge {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-ui);
}
```

### Responsive Tipografía

```css
/* Mobile First */
@media (max-width: 640px) {
  .h1, h1 {
    font-size: 40px;
  }
  
  .h2, h2 {
    font-size: 32px;
  }
  
  .h3, h3 {
    font-size: 24px;
  }
  
  .body, body, p {
    font-size: 16px;
  }
}
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Geist Sans', '-apple-system', 'sans-serif'],
      ui: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      'base': '16px',
      'lg': '18px',
      'xl': '24px',
      '2xl': '32px',
      '3xl': '44px',
      '4xl': '56px',
    },
    lineHeight: {
      'tight': '1.2',
      'snug': '1.25',
      'normal': '1.3',
      'relaxed': '1.35',
      'loose': '1.6',
    },
  },
}
```

---

## 7. ESPACIADO SISTEMA

### Base Unit = 4px

```css
:root {
  /* Espaciado base */
  --space-0: 0;
  --space-1: 4px;      /* xs */
  --space-2: 8px;      /* sm */
  --space-3: 12px;     /* md */
  --space-4: 16px;     /* lg */
  --space-5: 20px;     /* xl */
  --space-6: 24px;     /* 2xl */
  --space-8: 32px;     /* 3xl */
  --space-10: 40px;    /* 4xl */
  --space-12: 48px;    /* 5xl */
  --space-16: 64px;    /* 6xl */
  --space-20: 80px;    /* 7xl */
  --space-24: 96px;    /* 8xl */
}

/* Utilidades */
.gap-xs { gap: var(--space-2); }
.gap-sm { gap: var(--space-3); }
.gap-md { gap: var(--space-4); }
.gap-lg { gap: var(--space-6); }
.gap-xl { gap: var(--space-8); }
.gap-2xl { gap: var(--space-10); }

.p-xs { padding: var(--space-2); }
.p-sm { padding: var(--space-3); }
.p-md { padding: var(--space-4); }
.p-lg { padding: var(--space-6); }
.p-xl { padding: var(--space-8); }

.m-xs { margin: var(--space-2); }
.m-sm { margin: var(--space-3); }
.m-md { margin: var(--space-4); }
.m-lg { margin: var(--space-6); }
.m-xl { margin: var(--space-8); }
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    spacing: {
      0: '0',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
    },
  },
}
```

---

## 8. RADIOS (Border Radius)

```css
:root {
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-full: 9999px;
}

/* Utilidades */
.rounded-none { border-radius: var(--radius-none); }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-2xl { border-radius: var(--radius-2xl); }
.rounded-full { border-radius: var(--radius-full); }
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '20px',
      full: '9999px',
    },
  },
}
```

---

## 9. SOMBRAS

```css
:root {
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-focus: 0 0 0 3px rgba(43, 90, 124, 0.1);
}

/* Utilidades */
.shadow-none { box-shadow: var(--shadow-none); }
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-focus { box-shadow: var(--shadow-focus); }

/* Focus ring */
*:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    boxShadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      focus: '0 0 0 3px rgba(43, 90, 124, 0.1)',
    },
  },
}
```

---

## RESUMEN DE TOKENS

| Sistema | Principio | Valor Base |
|---------|-----------|-----------|
| Colores | Semánticos + Grays | 4 primarios |
| Tipografía | Escala modular 1.2 | Geist Sans + Inter |
| Espaciado | Múltiplos de 4px | 4px unit |
| Radios | Curvas suaves | 4px - 20px |
| Sombras | Muy sutiles | Alpha 0.05-0.1 |

**Todos los tokens están documentados y listos para:**
- ✓ CSS variables
- ✓ Tailwind config
- ✓ Figma design system
- ✓ Storybook documentation

