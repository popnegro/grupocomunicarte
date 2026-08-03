import React from "react";
import { Card } from "./Card";
import { cn } from "../utils/cn";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: string | number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <Card variant="premium" className={cn("flex flex-col justify-between p-6 h-full", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block select-none">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-display font-black tracking-tight leading-none text-stone-900">
            {value}
          </p>
        </div>
        {icon && (
          <div className="h-10 w-10 rounded-xl bg-[#06434a]/10 flex items-center justify-center text-[#06434a]">
            {icon}
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={cn(
              "inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-full",
              trend.type === "increase" && "bg-emerald-50 text-emerald-700 border border-emerald-200",
              trend.type === "decrease" && "bg-rose-50 text-rose-700 border border-rose-200",
              trend.type === "neutral" && "bg-stone-50 text-stone-500 border border-stone-200"
            )}>
              {trend.type === "increase" && "+"}
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-xs text-stone-400 font-medium">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
};
