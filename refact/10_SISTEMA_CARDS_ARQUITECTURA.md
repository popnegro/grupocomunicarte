# 10-12. SISTEMA DE CARDS Y ARQUITECTURA DE COMPONENTES

---

## 10. SISTEMA DE CARDS - Componentes Reutilizables

### BaseCard (Componente Padre)

```typescript
// components/ui/BaseCard.tsx
import { forwardRef, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'relative rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 shadow-sm hover:shadow-md',
        outlined: 'bg-transparent border-gray-200 hover:border-primary-400',
        elevated: 'bg-white shadow-md hover:shadow-lg',
        ghost: 'bg-transparent border-transparent hover:bg-gray-50',
      },
      padding: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'lg',
      interactive: false,
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  asChild?: boolean;
}

const BaseCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, padding, interactive, className })}
      {...props}
    />
  )
);

BaseCard.displayName = 'BaseCard';

export { BaseCard, cardVariants };
```

### FeatureCard

```typescript
// components/cards/FeatureCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function FeatureCard({
  icon,
  title,
  description,
  color = 'primary',
  action,
}: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    success: 'text-success',
    warning: 'text-warning',
  };

  return (
    <BaseCard variant="default" padding="lg" className="group">
      {/* Icon Container */}
      <div className={`${colorClasses[color]} text-4xl mb-4 transition-transform group-hover:scale-110`}>
        {icon}
      </div>

      {/* Content */}
      <h3 className="h4 mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-base mb-4">{description}</p>

      {/* CTA */}
      {action && (
        <a
          href={action.href}
          onClick={action.onClick}
          className="inline-flex items-center text-primary-400 font-medium text-sm hover:text-primary-500 transition-colors"
        >
          {action.label}
          <span className="ml-2">→</span>
        </a>
      )}
    </BaseCard>
  );
}
```

### ServiceCard

```typescript
// components/cards/ServiceCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';
import { ReactNode } from 'react';
import Image from 'next/image';

interface ServiceCardProps {
  image: string;
  badge?: string;
  title: string;
  description: string;
  highlights: string[];
  cta: {
    label: string;
    href: string;
  };
}

export function ServiceCard({
  image,
  badge,
  title,
  description,
  highlights,
  cta,
}: ServiceCardProps) {
  return (
    <BaseCard variant="default" padding="0" className="overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-primary-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-lg">
        <h3 className="h4 mb-2">{title}</h3>
        <p className="text-gray-600 text-base mb-4">{description}</p>

        {/* Highlights */}
        <ul className="space-y-2 mb-6">
          {highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-700">
              <span className="text-success mr-2 mt-1">✓</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={cta.href}
          className="inline-block bg-primary-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors"
        >
          {cta.label}
        </a>
      </div>
    </BaseCard>
  );
}
```

### BenefitCard

```typescript
// components/cards/BenefitCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';

interface BenefitCardProps {
  number: number;
  title: string;
  description: string;
}

export function BenefitCard({ number, title, description }: BenefitCardProps) {
  return (
    <BaseCard variant="outlined" padding="lg">
      {/* Number Badge */}
      <div className="text-4xl font-bold text-primary-400 mb-4">
        {String(number).padStart(2, '0')}
      </div>

      {/* Content */}
      <h3 className="h4 mb-2">{title}</h3>
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </BaseCard>
  );
}
```

### MetricCard

```typescript
// components/cards/MetricCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';

interface MetricCardProps {
  value: string | number;
  unit?: string;
  label: string;
  change?: {
    value: number;
    positive: boolean;
  };
}

export function MetricCard({ value, unit, label, change }: MetricCardProps) {
  return (
    <BaseCard variant="elevated" padding="lg" className="text-center">
      <div className="flex items-baseline justify-center gap-1 mb-2">
        <span className="text-4xl font-bold text-primary-400">{value}</span>
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </div>

      {change && (
        <div className={`text-sm font-medium mb-3 ${change.positive ? 'text-success' : 'text-error'}`}>
          {change.positive ? '↑' : '↓'} {change.value}%
        </div>
      )}

      <p className="text-gray-600 text-sm">{label}</p>
    </BaseCard>
  );
}
```

### TestimonialCard

```typescript
// components/cards/TestimonialCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';
import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  rating?: number; // 1-5
}

export function TestimonialCard({
  quote,
  author,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <BaseCard variant="default" padding="lg">
      {/* Rating */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-warning">★</span>
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="text-gray-700 text-base mb-6 leading-relaxed italic">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {author.avatar && (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900">{author.name}</p>
          <p className="text-sm text-gray-600">{author.title}</p>
        </div>
      </div>
    </BaseCard>
  );
}
```

### ClientCard

```typescript
// components/cards/ClientCard.tsx
import { BaseCard } from '@/components/ui/BaseCard';
import Image from 'next/image';

interface ClientCardProps {
  logo: string;
  name: string;
  type: string;
  impact?: string;
}

export function ClientCard({ logo, name, type, impact }: ClientCardProps) {
  return (
    <BaseCard variant="ghost" padding="md" className="flex flex-col items-center">
      <div className="mb-4 relative h-16 w-full">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain object-center"
        />
      </div>
      <p className="font-semibold text-center text-gray-900 mb-1">{name}</p>
      <p className="text-xs text-gray-600 text-center mb-2">{type}</p>
      {impact && (
        <p className="text-xs font-medium text-primary-400 text-center">{impact}</p>
      )}
    </BaseCard>
  );
}
```

### FAQCard

```typescript
// components/cards/FAQCard.tsx
import { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';

interface FAQCardProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export function FAQCard({ question, answer, defaultOpen = false }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <BaseCard
      variant="outlined"
      padding="lg"
      className="cursor-pointer hover:shadow-md"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="h4 flex-1 text-left">{question}</h3>
        <span className={`text-2xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </BaseCard>
  );
}
```

---

## 11. COMPONENTES REUTILIZABLES (Otros)

### Button Component

```typescript
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600',
        secondary: 'bg-secondary-400 text-white hover:bg-secondary-500 active:bg-secondary-600',
        outline: 'border-2 border-primary-400 text-primary-400 hover:bg-primary-50',
        ghost: 'text-primary-400 hover:bg-primary-50',
        success: 'bg-success text-white hover:bg-green-700',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, fullWidth, ...props }, ref) => (
  <button
    ref={ref}
    className={buttonVariants({ variant, size, fullWidth, className })}
    {...props}
  />
));

Button.displayName = 'Button';
```

### Badge Component

```typescript
// components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold',
  {
    variants: {
      variant: {
        primary: 'bg-primary-100 text-primary-700',
        secondary: 'bg-secondary-100 text-secondary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-orange-100 text-orange-700',
        error: 'bg-red-100 text-red-700',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export function Badge({ variant, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={badgeVariants({ variant })} {...props}>
      {children}
    </span>
  );
}
```

### Section Wrapper

```typescript
// components/ui/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  variant?: 'default' | 'alt' | 'dark';
}

export function Section({
  id,
  className = '',
  children,
  variant = 'default',
}: SectionProps) {
  const bgClasses = {
    default: 'bg-white',
    alt: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  };

  return (
    <section
      id={id}
      className={`py-20 px-4 md:px-8 lg:px-16 ${bgClasses[variant]} ${className}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
```

---

## 12. ARQUITECTURA DE COMPONENTES

### Estructura de Carpetas

```
src/
├── components/
│   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── BaseCard.tsx
│   │   ├── Section.tsx
│   │   └── ...
│   ├── cards/                 # Variantes de cards
│   │   ├── FeatureCard.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── MetricCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── ClientCard.tsx
│   │   └── FAQCard.tsx
│   ├── sections/              # Secciones de página
│   │   ├── Hero.tsx
│   │   ├── ValueProposition.tsx
│   │   ├── Benefits.tsx
│   │   ├── Services.tsx
│   │   ├── HowWorks.tsx
│   │   ├── Coverage.tsx
│   │   ├── Success.tsx
│   │   ├── Clients.tsx
│   │   ├── Metrics.tsx
│   │   ├── FAQ.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   ├── layout/                # Layouts principales
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Layout.tsx
│   └── shared/                # Componentes globales
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
├── styles/
│   ├── globals.css
│   ├── tokens.css             # Design tokens
│   └── animations.css
├── lib/
│   ├── cn.ts                  # Utility para classnames
│   ├── constants.ts           # Constantes
│   └── hooks/
│       ├── useInView.ts
│       └── useAnimation.ts
└── app/
    ├── layout.tsx
    ├── page.tsx
    └── not-found.tsx
```

### Flujo de Componentes

```
App
├── Layout (Header + Content + Footer)
│   ├── Navigation
│   │   └── Logo, Menu, CTA
│   └── Main Content
│       ├── Hero (FeatureCard + CTA)
│       ├── ValueProposition (Text block)
│       ├── Benefits (Grid de BenefitCard)
│       ├── Services (Grid de ServiceCard)
│       ├── HowWorks (Numbered steps)
│       ├── Coverage (Map + Stats)
│       ├── Success (Carousel de ServiceCard)
│       ├── Clients (Grid de ClientCard)
│       ├── Metrics (Grid de MetricCard)
│       ├── FAQ (Accordion de FAQCard)
│       ├── FinalCTA
│       └── Footer
```

### Principios de Composición

1. **Componentes Base (UI)**: Reutilizables, sin lógica de negocio
2. **Variantes (Cards)**: Especializaciones de BaseCard
3. **Secciones**: Composición de cards + layout
4. **Páginas**: Composición de secciones

---

## RESUMEN

**Sistema de Cards**:
- ✓ BaseCard como padre
- ✓ 7 variantes especializadas
- ✓ Composición sobre herencia
- ✓ CVA para variantes
- ✓ TypeScript strict

**Componentes Reutilizables**:
- ✓ Button con 5 variantes
- ✓ Badge con 5 colores
- ✓ Section wrapper
- ✓ Todas con Tailwind
- ✓ Accesibles (WCAG AA)

**Arquitectura**:
- ✓ Estructura clara y mantenible
- ✓ Escalable a nuevos componentes
- ✓ Preparada para shadcn/ui
- ✓ Listo para Storybook

