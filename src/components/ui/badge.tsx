import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#06434a]/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-stone-200 bg-stone-50 text-stone-700 shadow-sm",
        secondary:
          "border-stone-200 bg-white text-stone-700 shadow-sm",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700 shadow-sm",
        outline: "border-stone-200 bg-transparent text-stone-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
