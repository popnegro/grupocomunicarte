// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}


const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, fullWidth, ...props }, ref) => {
  // I removed asChild logic because Slot is not imported and the previous button did not have it.
  // This simplifies the component to align with the markdown's provided code.
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
});

Button.displayName = 'Button';

export { Button, buttonVariants };
