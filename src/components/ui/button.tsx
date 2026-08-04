import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06434a]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-stone-950 text-white shadow-sm hover:bg-[#06434a]",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        outline:
          "border border-stone-200 bg-white text-stone-800 shadow-sm hover:border-[#06434a]/20 hover:bg-stone-50 hover:text-[#06434a]",
        secondary:
          "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-200",
        ghost: "text-stone-700 hover:bg-stone-100 hover:text-stone-900",
        link: "text-stone-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 min-h-11 px-4 py-2.5",
        sm: "h-10 min-h-10 rounded-full px-3 text-xs",
        lg: "h-12 min-h-12 rounded-full px-8",
        icon: "h-11 w-11 min-h-11 min-w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
