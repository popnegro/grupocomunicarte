// components/ui/BaseCard.tsx
import { forwardRef, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

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
      className={cn(cardVariants({ variant, padding, interactive, className }))}
      {...props}
    />
  )
);

BaseCard.displayName = 'BaseCard';

export { BaseCard, cardVariants };
