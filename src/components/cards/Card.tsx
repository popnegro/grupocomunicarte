import React, { ComponentProps } from "react";
import { cardVariants, type CardVariants } from "./cardVariants";
import { cn } from "@/lib/utils";

interface CardProps extends ComponentProps<"div">, CardVariants {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "base", padding = "md", border, background, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, padding, border, background }),
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

// Convenience exports for common patterns
export const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("space-y-4", className)} {...props} />
);

export const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("space-y-2 border-b border-stone-100 pb-4", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex gap-3 pt-4 border-t border-stone-100", className)} {...props} />
);
