/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const radius = {
  none: "rounded-none",
  xs: "rounded-xs",    // 2px
  sm: "rounded-sm",    // 4px
  md: "rounded-md",    // 6px
  lg: "rounded-lg",    // 8px
  xl: "rounded-xl",    // 12px
  "2xl": "rounded-2xl", // 16px
  "3xl": "rounded-3xl", // 24px
  full: "rounded-full", // 9999px

  // Nested radius calculation helper
  nested: (outerRadiusPx: number, paddingPx: number): string => {
    const inner = Math.max(0, outerRadiusPx - paddingPx);
    return `rounded-[${inner}px]`;
  }
};
