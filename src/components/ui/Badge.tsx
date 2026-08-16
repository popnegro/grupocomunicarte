import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  base: "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
  variants: {
    variant: {
      default: "border-transparent bg-black text-white hover:bg-gray-800",
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
      destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
      outline: "text-gray-900",
      
      // Semantic UI Variants for Map
      neutral: "border-transparent bg-gray-100 text-gray-800",
      red: "border-transparent bg-red-100 text-red-800",
      dark: "border-transparent bg-gray-900 text-white",
      green: "border-transparent bg-emerald-100 text-emerald-800",
    },
  }
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: keyof typeof badgeVariants.variants.variant;
}

export function badgeStyles({ variant = "default", className }: { variant?: keyof typeof badgeVariants.variants.variant, className?: string } = {}) {
  return cn(badgeVariants.base, badgeVariants.variants.variant[variant], className)
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={badgeStyles({ variant, className })} {...props} />
  )
}

export { Badge }
