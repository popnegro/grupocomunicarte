import React from "react";
import { cn } from "../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "premium" | "obsidian" | "simple";
}

export const Card: React.FC<CardProps> = ({ className, variant = "premium", children, ...props }) => {
  const variants = {
    premium: "bg-white border border-stone-200/60 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#06434a]/20 transition-all duration-300 relative overflow-hidden text-left",
    obsidian: "bg-[#172023] border border-stone-800 rounded-xl p-6 text-white relative overflow-hidden text-left",
    simple: "bg-white border border-stone-200/60 rounded-xl p-6 text-left",
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
