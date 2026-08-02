// src/lib/designTokens.ts
// Centralized source of truth for design decisions
// Based on the audit and new visual language

export const brandColors = {
  primary: {
    DEFAULT: "var(--color-primary)",
    50: "var(--color-primary-50)",
    100: "var(--color-primary-100)",
    200: "var(--color-primary-200)",
    300: "var(--color-primary-300)",
    400: "var(--color-primary-400)",
    500: "var(--color-primary-500)",
    600: "var(--color-primary-600)",
    700: "var(--color-primary-700)",
    800: "var(--color-primary-800)",
    900: "var(--color-primary-900)",
    950: "var(--color-primary-950)",
  },
  secondary: {
    DEFAULT: "var(--color-secondary)",
    50: "var(--color-secondary-50)",
    100: "var(--color-secondary-100)",
    200: "var(--color-secondary-200)",
    300: "var(--color-secondary-300)",
    400: "var(--color-secondary-400)",
    500: "var(--color-secondary-500)",
    600: "var(--color-secondary-600)",
    700: "var(--color-secondary-700)",
    800: "var(--color-secondary-800)",
    900: "var(--color-secondary-900)",
    950: "var(--color-secondary-950)",
  },
  accent: {
    DEFAULT: "var(--color-accent)",
    50: "var(--color-accent-50)",
    100: "var(--color-accent-100)",
    200: "var(--color-accent-200)",
    300: "var(--color-accent-300)",
    400: "var(--color-accent-400)",
    500: "var(--color-accent-500)",
    600: "var(--color-accent-600)",
    700: "var(--color-accent-700)",
    800: "var(--color-accent-800)",
    900: "var(--color-accent-900)",
    950: "var(--color-accent-950)",
  },
  success: {
    DEFAULT: "var(--color-success)",
    50: "var(--color-success-50)",
    100: "var(--color-success-100)",
    200: "var(--color-success-200)",
    300: "var(--color-success-300)",
    400: "var(--color-success-400)",
    500: "var(--color-success-500)",
    600: "var(--color-success-600)",
    700: "var(--color-success-700)",
    800: "var(--color-success-800)",
    900: "var(--color-success-900)",
    950: "var(--color-success-950)",
  },
  warning: {
    DEFAULT: "var(--color-warning)",
    50: "var(--color-warning-50)",
    100: "var(--color-warning-100)",
    200: "var(--color-warning-200)",
    300: "var(--color-warning-300)",
    400: "var(--color-warning-400)",
    500: "var(--color-warning-500)",
    600: "var(--color-warning-600)",
    700: "var(--color-warning-700)",
    800: "var(--color-warning-800)",
    900: "var(--color-warning-900)",
    950: "var(--color-warning-950)",
  },
  error: {
    DEFAULT: "var(--color-error)",
    50: "var(--color-error-50)",
    100: "var(--color-error-100)",
    200: "var(--color-error-200)",
    300: "var(--color-error-300)",
    400: "var(--color-error-400)",
    500: "var(--color-error-500)",
    600: "var(--color-error-600)",
    700: "var(--color-error-700)",
    800: "var(--color-error-800)",
    900: "var(--color-error-900)",
    950: "var(--color-error-950)",
  },
};

export const typography = {
  fontFamily: {
    display: ["var(--font-display)", "sans-serif"],
    body: ["var(--font-body)", "sans-serif"],
    mono: ["var(--font-mono)", "monospace"],
  },
  fontSize: {
    "2xs": "0.625rem", // 10px
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem",// 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem",    // 48px
    "6xl": "3.75rem", // 60px
    "7xl": "4.5rem",  // 72px
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
  },
};

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem",    // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem",     // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem",    // 12px
  3.5: "0.875rem", // 14px
  4: "1rem",       // 16px
  5: "1.25rem",    // 20px
  6: "1.5rem",     // 24px
  7: "1.75rem",    // 28px
  8: "2rem",       // 32px
  9: "2.25rem",    // 36px
  10: "2.5rem",    // 40px
  11: "2.75rem",   // 44px
  12: "3rem",      // 48px
  14: "3.5rem",    // 56px
  16: "4rem",      // 64px
  20: "5rem",      // 80px
  24: "6rem",      // 96px
  32: "8rem",      // 128px
  40: "10rem",     // 160px
  48: "12rem",     // 192px
  56: "14rem",     // 224px
  64: "16rem",     // 256px
  72: "18rem",     // 288px
  80: "20rem",     // 320px
  96: "24rem",     // 384px
};

export const borderRadius = {
  none: "0",
  sm: "0.125rem",   // 2px
  md: "0.25rem",    // 4px
  lg: "0.5rem",     // 8px
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  "3xl": "1.5rem",  // 24px
  "4xl": "2rem",    // 32px
  "5xl": "2.5rem",  // 40px
  full: "9999px",
};

export const boxShadow = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  outline: "0 0 0 3px rgba(66, 153, 225, 0.5)", // Tailwind's default focus outline
};