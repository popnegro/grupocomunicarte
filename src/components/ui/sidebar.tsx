import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.25rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextType = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Media query to check if screen is mobile (using 768px for md breakpoint)
    const [isMobile, setIsMobile] = React.useState(false)
    const [openState, setOpenState] = React.useState(defaultOpen)

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const open = openProp !== undefined ? openProp : openState
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const nextOpen = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(nextOpen)
        } else {
          setOpenState(nextOpen)
        }

        // Set cookie for persistence if needed
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    const [openMobile, setOpenMobile] = React.useState(false)

    // Helper to toggle sidebar
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((prev) => !prev)
        : setOpen((prev) => !prev)
    }, [isMobile, setOpen, setOpenMobile])

    // Keyboard shortcut to toggle sidebar
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContextType>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full text-slate-950 dark:text-slate-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-stone-900 text-stone-200 dark:bg-stone-950 dark:text-stone-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      if (!openMobile) return null

      return (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setOpenMobile(false)}
          />
          {/* Mobile Sidebar Frame */}
          <div
            ref={ref}
            className={cn(
              "relative flex h-full w-[--sidebar-width-mobile] flex-col bg-stone-900 p-4 text-stone-200 shadow-xl transition-transform duration-300 ease-in-out dark:bg-stone-950",
              side === "left" ? "animate-slide-in-left" : "animate-slide-in-right",
              className
            )}
            style={
              {
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            {...props}
          >
            {children}
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* Sidebar Gap Filler (keeps layout flow correct when sidebar is floating) */}
        <div
          className={cn(
            "relative h-svh bg-transparent transition-[width] duration-200 ease-in-out",
            "w-[--sidebar-width]",
            state === "collapsed" && "w-[--sidebar-width-icon]"
          )}
        />
        {/* Main Sidebar Panel */}
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] flex-col bg-stone-900 text-stone-200 transition-[width,transform,box-shadow] duration-200 ease-in-out md:flex dark:bg-stone-950",
            side === "left" ? "left-0 border-r border-stone-800" : "right-0 border-l border-stone-800",
            state === "collapsed" && "w-[--sidebar-width-icon]",
            variant === "floating" && "inset-y-2 m-2 rounded-2xl border border-stone-800 shadow-lg",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 text-stone-400 hover:text-stone-100 hover:bg-stone-800/50", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4 shrink-0", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-4 mt-auto shrink-0", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 p-2 w-full", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { state } = useSidebar()
  if (state === "collapsed") return null

  return (
    <div
      ref={ref}
      className={cn(
        "px-3 py-1.5 text-[10px] font-bold text-stone-500 uppercase tracking-wider select-none",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("w-full space-y-1", className)}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn("flex w-full flex-col gap-1 list-none p-0 m-0", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("w-full relative", className)}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "w-full flex items-center gap-3 rounded-lg font-semibold transition-all cursor-pointer select-none text-stone-300 hover:bg-stone-800/50 hover:text-white focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        active: "bg-stone-800 text-white shadow-xs",
      },
      size: {
        default: "h-9 px-3 text-sm",
        sm: "h-7 px-2 text-xs",
        lg: "h-12 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  tooltip?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "active"
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, size, asChild = false, onClick, tooltip, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  const { state, isMobile, setOpenMobile } = useSidebar()

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (isMobile) {
        setOpenMobile(false)
      }
      onClick?.(event)
    },
    [isMobile, setOpenMobile, onClick]
  )

  return (
    <Comp
      ref={ref}
      className={cn(sidebarMenuButtonVariants({ variant, size, className }), state === "collapsed" && "justify-center px-0 w-9 h-9 mx-auto")}
      onClick={handleClick}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }
>(({ className, showOnHover = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md p-0 text-stone-400 outline-none transition-all hover:bg-stone-850 hover:text-white focus-visible:ring-1",
        showOnHover && "opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-slate-50 dark:bg-stone-900",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

