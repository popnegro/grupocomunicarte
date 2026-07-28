// components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

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
    <span className={cn(badgeVariants({ variant }))} {...props}>
      {children}
    </span>
  );
}
