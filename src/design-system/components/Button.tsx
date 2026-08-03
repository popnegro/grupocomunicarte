import React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "danger" | "success" | "warning";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs select-none focus:outline-hidden focus:ring-2 focus:ring-[#06434a]/20 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-[#06434a] hover:bg-[#0b5e67] active:bg-[#053035] text-white shadow-xs focus:ring-[#06434a]/30",
    secondary: "border border-stone-250 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800",
    outline: "border border-[#06434a]/30 bg-transparent text-[#06434a] hover:bg-[#06434a]/5 active:bg-[#06434a]/10",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-50 active:bg-stone-100 shadow-none",
    link: "bg-transparent text-[#06434a] hover:underline shadow-none p-0 h-auto normal-case tracking-normal",
    danger: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs focus:ring-rose-500/30",
    success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs focus:ring-emerald-500/30",
    warning: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-xs focus:ring-amber-500/30",
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-[10px]",
    sm: "px-3.5 py-2 text-xs",
    md: "px-4.5 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
    xl: "px-8 py-4.5 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
