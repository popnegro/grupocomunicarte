import React from "react";
import { Card, CardContent } from "@components/ui/card";
import { Skeleton } from "@components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string | number;
  variation?: string;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  sparkline?: number[];
  tooltip?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  subtitle,
  value,
  variation,
  trend = "neutral",
  percentage,
  sparkline,
  tooltip,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-8 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
    );
  }

  // Generate SVG Sparkline if array provided
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const maxVal = Math.max(...sparkline);
    const minVal = Math.min(...sparkline);
    const range = maxVal - minVal || 1;
    const width = 80;
    const height = 24;
    
    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - minVal) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    const strokeColor = trend === "up" ? "#10b981" : trend === "down" ? "#f43f5e" : "#64748b";

    return (
      <svg className="h-6 w-20 shrink-0 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card className="group relative h-full flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Background Accent Highlight */}
      <div className={`absolute top-0 left-0 w-full h-[3px] transition-colors ${
        trend === "up" 
          ? "bg-emerald-500/80" 
          : trend === "down" 
          ? "bg-rose-500/80" 
          : "bg-slate-300"
      }`} />

      <div className="space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
              {subtitle && <span className="text-[10px] text-slate-400 font-medium">{subtitle}</span>}
            </div>
            {tooltip && (
              <div className="relative group/tooltip">
                <HelpCircle className="h-3.5 w-3.5 cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/tooltip:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md z-50">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              trend === "up" 
                ? "bg-emerald-50 text-emerald-600" 
                : trend === "down" 
                ? "bg-rose-50 text-rose-600" 
                : "bg-slate-100 text-slate-600"
            )}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
            
            {/* Variation / Trend indicators */}
            {(variation || percentage !== undefined) && <div className="flex items-center gap-1.5 mt-1">
              {trend === "up" && (
                <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  {percentage !== undefined ? `+${percentage}%` : ""}
                </span>
              )}
              {trend === "down" && (
                <span className="text-rose-600 bg-rose-50 border border-rose-100 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <TrendingDown className="h-3 w-3" />
                  {percentage !== undefined ? `-${percentage}%` : ""}
                </span>
              )}
              {trend === "neutral" && (
                <span className="text-slate-500 bg-slate-50 border border-slate-150 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Minus className="h-3 w-3" />
                  Estable
                </span>
              )}

              {variation && (
                <span className="text-[10px] text-slate-400 font-medium">{variation}</span>
              )}
            </div>}
          </div>

          {/* Render real Sparkline trend if array passed */}
          {renderSparkline()}
        </div>
      </div>
    </Card>
  );
};
