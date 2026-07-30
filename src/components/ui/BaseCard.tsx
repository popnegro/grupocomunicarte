import React, { useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: '',
        interactive: 'cursor-pointer hover:bg-muted/50 transition-colors',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const BaseCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';

    const memoizedCardVariants = useMemo(() => cardVariants({ variant }), [variant]);

    const commonProps = {
      className: cn(memoizedCardVariants, className),
      ref,
      ...props,
    };

    if (variant === 'interactive') {
      return (
        <button {...commonProps} />
      );
    }

    return <Comp {...commonProps} />;
  }
);
BaseCard.displayName = 'BaseCard';

export { BaseCard };
