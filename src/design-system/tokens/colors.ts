/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const colors = {
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
    base: "#07be8a", // Mint green
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
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      800: "#292524",
      900: "#172023",
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
};
