import React, { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/src/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        interactive: 'cursor-pointer hover:bg-muted/50 transition-colors',
        outlined: 'border-2 border-muted bg-transparent',
        ghost: 'border-none bg-transparent shadow-none',
        elevated: 'shadow-md border-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const BaseCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    const memoizedCardVariants = useMemo(() => cardVariants({ variant, padding }), [variant, padding]);

    const commonProps = {
      className: cn(memoizedCardVariants, className),
      ref,
      ...props,
    };

    if (variant === 'interactive') {
      return (
        <button {...(commonProps as any)} />
      );
    }

    return <Comp {...commonProps} />;
  }
);
BaseCard.displayName = 'BaseCard';

export { BaseCard };
