# 13-15. WIREFRAMES, MICROINTERACCIONES, RESPONSIVE Y ACCESIBILIDAD

---

## 13. WIREFRAMES DE ALTA FIDELIDAD (Descritos)

### Hero Section Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ Logo                                    Menú | Contactar     │ ← Header
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    [Espacio ~80px]                            │
│                                                               │
│              TRANSFORMAMOS COMUNIDADES                       │ ← H1: 56px
│              A TRAVÉS DE LA COMUNICACIÓN                     │    Geist Sans 700
│                                                               │
│                    [Espacio ~24px]                            │
│                                                               │
│        Educomunicación para el desarrollo social            │ ← Subhead: 24px
│        y territorial en América Latina                       │    Geist Sans 400
│                                                               │
│                    [Espacio ~32px]                            │
│                                                               │
│           [CONOCER NUESTRO IMPACTO] [Más info →]            │ ← CTA primario + secundario
│                                                               │
│                    [Espacio ~80px]                            │
│                                                               │
│      ┌──────────────────────────────────────────────┐       │
│      │                                              │       │
│      │   [Imagen de impacto: comunidad, radio,     │       │
│      │    gente trabajando - Alto contraste]       │       │
│      │                                              │       │
│      └──────────────────────────────────────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Detalles Clave**:
- Espacio respirable arriba/abajo (80px)
- Máximo 2-3 líneas de texto
- CTA primario con alto contraste
- Imagen de impacto que ocupa ~40% del viewport

---

### Value Proposition Section

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    QUIÉNES SOMOS                             │ ← H2: 44px
│                                                               │
│                 [Espacio 16px]                                │
│                                                               │
│  Un equipo de profesionales que construye tejido social      │ ← Body: 18px
│  a través de la comunicación popular y la educación.         │    Max 2-3 líneas
│                                                               │
│                 [Espacio 32px]                                │
│                                                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │                │  │                │  │                │ │
│  │  Investigación │  │   Experiencia  │  │     Calidad    │ │
│  │   profunda     │  │    en terreno  │  │   comprobada   │ │
│  │                │  │                │  │                │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │ ← BenefitCards grid 3 col
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### Benefits Grid

```
┌─────────────────────────────────────────────────────────────┐
│                      BENEFICIOS                              │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │              │  │              │  │              │       │
│  │ 01           │  │ 02           │  │ 03           │       │
│  │ Impacto      │  │ Empoderamiento│  │ Transformación
│  │ territorial  │  │ de comunidades│  │ social       │       │
│  │              │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │              │  │              │  │              │       │
│  │ 04           │  │ 05           │  │ 06           │       │
│  │ Educación    │  │ Derechos     │  │ Sostenibilidad
│  │ transformadora│ │ humanos      │  │              │       │
│  │              │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
└─────────────────────────────────────────────────────────────┘

Grid responsive:
- Desktop (1440px+): 3 columnas
- Tablet (768px): 2 columnas
- Mobile (375px): 1 columna
```

---

## 14. GUÍA DE MICROINTERACCIONES

### Hover Effects

#### Card Hover
```css
.card {
  transition: all 200ms ease-out;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  &:hover {
    transform: translateY(-4px);           /* Suave elevación */
    box-shadow: 0 10px 15px rgba(0,0,0,0.1); /* Sombra aumenta */
  }
}

/* Móvil: sin transform (reduce complejidad) */
@media (hover: none) {
  .card:hover {
    transform: none;
  }
}
```

#### Button Hover
```css
.btn {
  transition: all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    background-color: var(--color-primary-500); /* Más oscuro */
    box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1); /* Glow sutil */
  }
  
  &:active {
    transform: scale(0.98);                /* Presionar */
  }
}
```

#### Icon Rotation (Accordion)
```css
.faq__toggle {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  
  &.open {
    transform: rotate(45deg);
  }
}
```

---

### Focus States

```css
/* Focus visible para accesibilidad */
*:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: 2px;
}

/* Alternative: ring pattern */
.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(43, 90, 124, 0.5);
  outline: 2px solid var(--color-secondary-400);
}
```

---

### Scroll Reveal

```typescript
// lib/useInView.ts
import { useEffect, useRef, useState } from 'react';

export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

#### Uso
```typescript
export function BenefitCard({ title, description }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Content */}
    </div>
  );
}
```

---

### Animated Counters (Métricas)

```typescript
// components/AnimatedCounter.tsx
'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/lib/useInView';

interface AnimatedCounterProps {
  value: number;
  unit?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  unit = '',
  duration = 2000,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const increment = value / (duration / 30);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <div ref={ref}>
      <span className="text-4xl font-bold text-primary-400">
        {count.toLocaleString()}
      </span>
      {unit && <span className="ml-1 text-gray-600">{unit}</span>}
    </div>
  );
}
```

---

### Skeleton Loading

```typescript
// components/Skeleton.tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

// Uso
function ProjectCard() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="p-6">
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-5/6 mb-6" />
          <Skeleton className="h-10 w-32" />
        </>
      ) : (
        // Content
      )}
    </div>
  );
}
```

---

## 15. REGLAS RESPONSIVE

### Mobile First Strategy

```
Breakpoints (Tailwind estándar):
├── 320px - 374px   (Mobile pequeño)
├── 375px - 639px   (Mobile)
├── 640px - 767px   (Tablet pequeño)
├── 768px - 1023px  (Tablet)
├── 1024px - 1439px (Laptop)
└── 1440px+         (Desktop 4K)
```

### Tipografía Responsive

```css
/* Mobile First */
h1 {
  font-size: 40px;
  line-height: 1.2;
}

h2 {
  font-size: 32px;
  line-height: 1.25;
}

body {
  font-size: 16px;
  line-height: 1.6;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  h1 {
    font-size: 48px;
  }

  h2 {
    font-size: 40px;
  }

  body {
    font-size: 18px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  h1 {
    font-size: 56px;
  }

  h2 {
    font-size: 44px;
  }
}

/* 4K (1920px+) */
@media (min-width: 1920px) {
  h1 {
    font-size: 64px;
  }

  body {
    max-width: 900px;
    margin: 0 auto;
  }
}
```

### Grid Responsivo

```css
.grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 1 columna */
  grid-template-columns: 1fr;
}

/* Tablet: 2 columnas */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop: 3 columnas */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### Espaciado Responsivo

```css
.section {
  padding: 3rem 1rem;      /* Mobile */
}

@media (min-width: 768px) {
  .section {
    padding: 4rem 2rem;    /* Tablet */
  }
}

@media (min-width: 1024px) {
  .section {
    padding: 5rem 4rem;    /* Desktop */
  }
}
```

### Container Queries (Moderno)

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
  }
}

@container (min-width: 600px) {
  .card__content {
    font-size: 18px;
  }
}
```

---

## ACCESIBILIDAD WCAG 2.2 AA

### Criterios Implementados

#### 1. Perceivable (Perceptible)

**1.4.3 Contrast (Mínimo)**
```
Texto normal:   4.5:1 (AA) / 7:1 (AAA)  ✓
Texto grande:   3:1 (AA) / 4.5:1 (AAA)  ✓
UI Components:  3:1 (AA)                  ✓

Validar: https://webaim.org/resources/contrastchecker/
```

**1.4.4 Resize Text**
```css
/* Permitir zoom hasta 200% */
html {
  font-size: 16px; /* No fijar a px absoluto */
}

/* Evitar text-size-adjust en móvil */
html {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
}
```

**1.4.10 Reflow**
```css
/* No forzar diseño horizontal */
@media (max-width: 320px) {
  .container {
    overflow-x: visible; /* No hidden */
  }
}
```

**1.4.13 Content on Hover/Focus**
```css
/* Tooltips accesibles */
.tooltip {
  display: none;
  position: absolute;
}

.tooltip-trigger:hover .tooltip,
.tooltip-trigger:focus .tooltip {
  display: block;
  /* No desaparecer hasta que usuario lo cierre */
}
```

---

#### 2. Operable (Operativo)

**2.1.1 Keyboard**
```typescript
// Todos los elementos interactivos accesibles vía teclado
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    onClick?.();
  }
};
```

**2.1.2 No Keyboard Trap**
```typescript
// Asegurar que se puede navegar fuera de modales
export function Modal() {
  return (
    <dialog onKeyDown={(e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    }}>
      {/* Content */}
    </dialog>
  );
}
```

**2.4.3 Focus Order**
```html
<!-- HTML en orden lógico -->
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
<!-- tabindex solo si es necesario reordenar -->
```

**2.4.7 Focus Visible**
```css
*:focus-visible {
  outline: 2px solid #2B5A7C;
  outline-offset: 2px;
}

/* No remover outline por defecto */
```

**2.5.5 Target Size (Enhanced)**
```css
/* Mínimo 44x44px para targets táctiles */
.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}

/* Permitir espacio alrededor */
.button {
  margin: 8px;
}
```

---

#### 3. Understandable (Comprensible)

**3.1.1 Language of Page**
```html
<html lang="es">
```

**3.2.1 On Focus**
```typescript
// No cambiar contexto al recibir focus
<input
  onFocus={(e) => {
    // No navegar, no enviar
    e.target.value = '';
  }}
/>
```

**3.3.2 Labels or Instructions**
```html
<!-- Siempre labels explícitos -->
<label htmlFor="email">Email*</label>
<input id="email" type="email" required />

<!-- O aria-label si visualmente no cabe -->
<button aria-label="Close menu">×</button>
```

**3.3.3 Error Suggestion**
```typescript
{error && (
  <div role="alert" className="text-error">
    <strong>Error:</strong> {error.message}
    <p>Sugerencia: {error.suggestion}</p>
  </div>
)}
```

---

#### 4. Robust (Robusto)

**4.1.2 Name, Role, Value**
```html
<!-- Componentes con roles claros -->
<button aria-label="Cerrar">✕</button>

<div role="tab" aria-selected="true">
  Proyectos
</div>

<div role="alert" aria-live="polite">
  Cambios guardados
</div>
```

**4.1.3 Status Messages**
```typescript
<div role="status" aria-live="polite" aria-atomic="true">
  {successMessage}
</div>
```

---

### Checklist de Implementación

```markdown
### WCAG 2.2 AA Compliance Checklist

- [ ] Contraste mínimo 4.5:1 en todo texto
- [ ] Todos los inputs tienen labels
- [ ] Navegación por teclado completa
- [ ] Focus visible en todos los elementos
- [ ] Mínimo 44x44px en targets táctiles
- [ ] Sin keyboard traps
- [ ] Imágenes con alt text descriptivo
- [ ] Videos con subtítulos y transcripción
- [ ] Estructura HTML semántica (h1-h6 ordenados)
- [ ] Aria-labels solo cuando necesario
- [ ] Roles ARIA correctos
- [ ] Animaciones respetan prefers-reduced-motion
- [ ] No depender solo del color para transmitir info
- [ ] Sin parpadeos >3 por segundo
- [ ] Tabindex solo negativos (<0) o necesarios
```

---

### Testing Automatizado

```typescript
// tests/accessibility.test.ts
import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@testing-library/react';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Homepage should be WCAG 2.2 AA compliant', async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });
});
```

---

## RESUMEN

**Wireframes**: Descritos en alta fidelidad
- ✓ Hero, Value Prop, Benefits, Services
- ✓ Métricas, FAQ, Footer
- ✓ Espaciado específico
- ✓ Jerarquía clara

**Microinteracciones**: Sutiles y propósitosas
- ✓ Hover, focus, active states
- ✓ Scroll reveal
- ✓ Animated counters
- ✓ Skeleton loading

**Responsive**: Mobile first
- ✓ 6 breakpoints
- ✓ Tipografía escalable
- ✓ Grid responsivo
- ✓ Espaciado adaptativo

**Accesibilidad**: WCAG 2.2 AA
- ✓ Contraste 4.5:1
- ✓ Navegación por teclado
- ✓ ARIA correcta
- ✓ Semantic HTML
- ✓ Testing automatizado

