import * as React from "react"
import { Loader2 } from "lucide-react"

import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { cn } from "@/src/lib/utils"

type CatalogCardVariant = "default" | "compact"

interface CatalogCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  variant?: CatalogCardVariant
  selected?: boolean
  loading?: boolean
}

const CatalogCard = React.forwardRef<HTMLDivElement, CatalogCardProps>(
  ({ className, variant = "default", selected = false, loading = false, ...props }, ref) => {
    const baseClasses =
      variant === "compact"
        ? "group relative overflow-hidden rounded-[20px] border border-stone-200 bg-white text-stone-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#06434a]/25 hover:shadow-md focus-within:border-[#06434a] focus-within:ring-2 focus-within:ring-[#06434a]/15"
        : "group relative overflow-hidden rounded-[24px] border border-stone-200 bg-white text-stone-950 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#06434a]/25 hover:shadow-md focus-within:border-[#06434a] focus-within:ring-2 focus-within:ring-[#06434a]/15"

    return (
      <Card
        ref={ref}
        className={cn(
          baseClasses,
          selected && "border-[#06434a] shadow-md ring-2 ring-[#06434a]/12",
          loading && "opacity-80",
          "shadow-[0_10px_30px_-12px_rgba(6,67,74,0.14)]",
          className
        )}
        {...props}
      />
    )
  }
)
CatalogCard.displayName = "CatalogCard"

const CatalogCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardContent>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("p-5 sm:p-6 lg:p-6", className)} {...props} />
))
CatalogCardContent.displayName = "CatalogCardContent"

const CatalogCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CardFooter>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    className={cn("flex items-center justify-between gap-3 border-t border-stone-100 p-5 pt-3 sm:p-6 sm:pt-3", className)}
    {...props}
  />
))
CatalogCardFooter.displayName = "CatalogCardFooter"

interface CatalogCardBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge> {}

const CatalogCardBadge = React.forwardRef<HTMLDivElement, CatalogCardBadgeProps>(
  ({ className, ...props }, ref) => (
    <Badge
      ref={ref}
      className={cn(
        "rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 shadow-[0_2px_8px_rgba(15,23,42,0.04)]",
        className
      )}
      {...props}
    />
  )
)
CatalogCardBadge.displayName = "CatalogCardBadge"

interface CatalogCardActionProps extends React.ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean
}

const CatalogCardAction = React.forwardRef<HTMLButtonElement, CatalogCardActionProps>(
  ({ className, loading = false, disabled, children, ...props }, ref) => (
    <Button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "h-10 rounded-full px-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-sm transition-all duration-200 active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Procesando</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
)
CatalogCardAction.displayName = "CatalogCardAction"

export { CatalogCard, CatalogCardContent, CatalogCardFooter, CatalogCardBadge, CatalogCardAction }
export type { CatalogCardVariant }
