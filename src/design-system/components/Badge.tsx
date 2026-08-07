import React from "react";
import { cn } from "../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const baseStyles = "inline-flex items-center text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full select-none";

  const variants = {
    primary: "bg-[#06434a]/10 text-[#06434a] border border-[#06434a]/25",
    secondary: "bg-[#07be8a]/10 text-[#07be8a] border border-[#07be8a]/25",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    neutral: "bg-stone-50 text-stone-500 border border-stone-200",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
