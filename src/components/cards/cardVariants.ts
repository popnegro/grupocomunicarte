import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "rounded-xl border transition-all duration-300 overflow-hidden relative",
  {
    variants: {
      variant: {
        // Base: Simple card, no hover effects
        base: cn(
          "bg-white border-stone-200/60",
          "shadow-xs"
        ),
        
        // Elevated: Card that lifts on hover
        elevated: cn(
          "bg-white border-stone-200/60",
          "shadow-xs hover:shadow-md hover:border-[#06434a]/20"
        ),
        
        // Interactive: Clickable card with active state
        interactive: cn(
          "bg-white border-stone-200/60",
          "shadow-xs cursor-pointer",
          "hover:shadow-md hover:border-[#06434a]/20",
          "active:shadow-base active:scale-[0.98]"
        ),
      },
      
      padding: {
        sm: "p-4",
        md: "p-6",    // default
        lg: "p-8",
        none: "p-0",
      },
      
      border: {
        light: "border-stone-200/60",
        medium: "border-stone-200",
        strong: "border-stone-300",
      },
      
      background: {
        white: "bg-white",
        light: "bg-stone-50",
        muted: "bg-stone-100",
      },
    },
    
    defaultVariants: {
      variant: "base",
      padding: "md",
      border: "light",
      background: "white",
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;
