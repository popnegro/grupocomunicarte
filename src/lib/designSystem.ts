/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { cn } from "./utils";

/**
 * Grupo Comunicarte - Single Source of Truth Design System (Premium Tokens & Guidelines)
 * Inspired by Linear, Stripe, Apple, and Vercel.
 * Provides ready-to-use Tailwind class combinations, programmatic design values,
 * and standard responsive states.
 */

export const DESIGN_SYSTEM = {
  // 1. Color Tokens
  colors: {
    primary: {
      base: "#06434a", // Deep slate teal
      hover: "#0b5e67",
      active: "#053035",
      light: "#e6f2f3",
      tailwind: "bg-[#06434a]",
      text: "text-[#06434a]",
      border: "border-[#06434a]/10",
    },
    secondary: {
      base: "#07be8a", // Mint green (conversion)
      hover: "#06a376",
      active: "#04805c",
      light: "#e6fdf6",
      tailwind: "bg-[#07be8a]",
      text: "text-[#07be8a]",
    },
    neutral: {
      dark: "#172023", // Obsidian dark slate
      light: "#fafaf9", // Warm sandstone paper
      white: "#ffffff",
      stone: {
        50: "bg-[#fafaf9]",
        100: "bg-stone-100",
        200: "bg-stone-200",
        400: "bg-stone-400",
        500: "bg-stone-500",
        600: "bg-stone-600",
        800: "bg-stone-800",
        900: "bg-[#172023]",
      }
    },
    semantic: {
      success: {
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
      },
      warning: {
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-100",
      },
      danger: {
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-100",
      },
      info: {
        text: "text-indigo-700",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
      }
    }
  },

  // 2. Typography Scale (Ratio 1.125 Major Second - Dense UI / High Flexibility)
  typography: {
    display: "font-display font-black tracking-tight leading-[1.05] text-stone-900",
    h1: "font-display font-black tracking-tight leading-[1.1] text-stone-900 text-3xl md:text-4xl",
    h2: "font-display font-extrabold tracking-tight leading-[1.2] text-stone-900 text-2xl md:text-3xl",
    h3: "font-display font-bold tracking-tight leading-[1.25] text-stone-900 text-xl md:text-2xl",
    h4: "font-display font-bold tracking-tight leading-[1.3] text-stone-900 text-lg",
    body: {
      standard: "font-sans text-sm md:text-base leading-relaxed text-stone-500 font-medium",
      compact: "font-sans text-xs md:text-sm leading-normal text-stone-600 font-medium",
      muted: "font-sans text-xs text-stone-400 font-medium",
    },
    label: {
      mono: "font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest block select-none",
      interactive: "font-sans text-xs font-bold uppercase tracking-wider select-none",
    }
  },

  // 3. Spacing Scale (8px Multiples)
  spacing: {
    micro: "p-1 gap-1",       // 4px
    tight: "p-2 gap-2",       // 8px
    base: "p-4 gap-4",         // 16px
    generous: "p-6 gap-6",     // 24px
    section: "py-24 px-6 gap-16",  // 48px
  },

  // 4. Border Radius (Linear/Vercel crispness - no extreme curves except pills)
  radius: {
    xs: "rounded-sm",    // 2px
    sm: "rounded-md",    // 6px
    base: "rounded-xl",  // 12px
    lg: "rounded-2xl",   // 16px
    xl: "rounded-3xl",   // 24px
    pill: "rounded-full", // 9999px
    /**
     * Calculates nested border radius to prevent optical overlap gaps
     * Inner Radius = Outer Radius - Padding
     */
    nested: (outerRadiusPx: number, paddingPx: number): string => {
      const inner = Math.max(0, outerRadiusPx - paddingPx);
      return `rounded-[${inner}px]`;
    }
  },

  // 5. Shadows & Elevations
  shadows: {
    xs: "shadow-xs",       // Hairline soft shadow
    sm: "shadow-sm",       // Light card shadow
    base: "shadow-md",     // Premium floating component
    lg: "shadow-lg",       // Dialog / Drawer
    xl: "shadow-2xl",      // Monumental dropdown / visual asset
    stripe: "shadow-[0_15px_35px_rgba(50,50,93,0.1),0_5px_15px_rgba(0,0,0,0.07)]", // Premium Stripe style
    linear: "shadow-[0_1px_1px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)]", // Crisp Linear style
  },

  // 6. Animation Timings & Easing Curves (Framer Motion compliant)
  animations: {
    transitions: {
      smooth: { type: "spring", stiffness: 300, damping: 30 },
      bouncy: { type: "spring", stiffness: 400, damping: 20 },
      fade: { duration: 0.2, ease: "easeInOut" },
    },
    hover: "transition-all duration-300 ease-in-out",
  },

  // 7. Grid System & Container Constraints
  grid: {
    container: "w-full max-w-7xl mx-auto px-6",
    layout: {
      threeCol: "grid grid-cols-1 md:grid-cols-3 gap-8",
      twoCol: "grid grid-cols-1 lg:grid-cols-2 gap-12",
      bento: "grid grid-cols-1 md:grid-cols-12 gap-6",
    }
  },

  // 8. Device Breakpoints (Desktop-First precision, Mobile-First code)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  // 9. Standard Interactive Component States
  states: {
    // Buttons
    button: {
      primary: "bg-[#06434a] hover:bg-[#0b5e67] active:bg-[#053035] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:pointer-events-none select-none flex items-center justify-center gap-2",
      secondary: "border border-stone-200 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-850 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-2",
      mint: "bg-[#07be8a] hover:bg-[#06a376] active:bg-[#04805c] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs select-none flex items-center justify-center gap-2",
      text: "text-[#06434a] hover:text-[#0b5e67] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer select-none flex items-center gap-1.5",
    },
    // Input Fields
    input: {
      base: "w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-850 outline-hidden transition-all placeholder:text-stone-400 focus:border-2 focus:border-[#06434a] focus:ring-1 focus:ring-[#06434a]/20 focus:shadow-xs",
      error: "border-2 border-rose-500 bg-rose-50/50 text-rose-700 placeholder:text-rose-300 focus:border-rose-600 focus:ring-rose-200",
      disabled: "bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed",
    },
    // Cards
    card: {
      premium: "bg-white border border-stone-200/60 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#06434a]/20 transition-all duration-300 relative overflow-hidden",
      obsidian: "bg-[#172023] border border-stone-800 rounded-xl p-6 text-white relative overflow-hidden",
    },
  },

  // 10. Accessibility Check standard touch targets (WCAG 2.2 AA compliant)
  accessibility: {
    touchTargetMin: "min-h-[44px] min-w-[44px]",
    screenReaderOnly: "sr-only",
    contrastRatioBody: "12:1 (Text #172023 over bg #fafaf9)",
    contrastRatioActive: "7.1:1 (White over primary #06434a)",
  }
};
