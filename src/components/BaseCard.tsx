import React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface BaseCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "onTransitionStart"
> {
  children?: React.ReactNode;
  className?: string;
  
  // Image layout options
  imageSrc?: string;
  imageAlt?: string;
  imageAspectRatio?: "square" | "video" | "wide" | "auto";
  
  // Badge / Pill at the top
  badge?: React.ReactNode;
  
  // Main title and description
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  
  // Statistic options
  statValue?: string | number;
  statLabel?: string;
  statTrend?: {
    type: "up" | "down" | "neutral";
    value?: string | number;
  };
  
  // Footer content
  footer?: React.ReactNode;
  
  // Visual variations
  hoverable?: boolean;
  accentBorder?: boolean;
  shadowSize?: "none" | "sm" | "md" | "lg";
  borderRadius?: "xl" | "2xl" | "3xl";
  backgroundColor?: "white" | "glass" | "stone" | "accent";
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className,
  imageSrc,
  imageAlt = "Card image",
  imageAspectRatio = "video",
  badge,
  title,
  subtitle,
  statValue,
  statLabel,
  statTrend,
  footer,
  hoverable = true,
  accentBorder = false,
  shadowSize = "sm",
  borderRadius = "2xl",
  backgroundColor = "glass",
  onClick,
  ...props
}) => {
  // Translate border-radius to outer Tailwind classes
  const radiusClasses = {
    xl: "rounded-2xl",
    "2xl": "rounded-3xl",
    "3xl": "rounded-[32px]",
  };

  // Translate nested inner border-radius (Outer Radius - Padding)
  // Since padding is usually p-6 (24px) or p-8 (32px):
  // - 2xl (24px radius) with p-6 (24px) -> inner corner should be quite sharp or slightly rounded
  // - 3xl (32px radius) with p-6 (24px) -> inner corner is ~8px (rounded-lg)
  const innerRadiusClasses = {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-2xl",
  };

  const shadowClasses = {
    none: "shadow-none",
    sm: "shadow-[0_6px_24px_-8px_rgba(40,30,20,0.02)]",
    md: "shadow-[0_12px_32px_-10px_rgba(40,30,20,0.04)]",
    lg: "shadow-[0_20px_48px_-12px_rgba(40,30,20,0.06)]",
  };

  const bgClasses = {
    white: "bg-white",
    glass: "bg-white/95 backdrop-blur-xs",
    stone: "bg-stone-50/50",
    accent: "bg-[#C47D50]/5 border-[#C47D50]/20",
  };

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    auto: "h-auto",
  };

  const cardContent = (
    <div className="flex flex-col h-full w-full">
      {/* 1. Header Image Block with Hover Scaling and Nested Corners */}
      {imageSrc && (
        <div 
          className={cn(
            "relative overflow-hidden w-full select-none",
            aspectClasses[imageAspectRatio],
            borderRadius === "xl" ? "rounded-t-xl" : borderRadius === "2xl" ? "rounded-t-[20px]" : "rounded-t-[24px]"
          )}
        >
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            whileHover={hoverable ? { scale: 1.04 } : {}}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
          />
          {badge && (
            <div className="absolute top-4 left-4 z-10">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* 2. Main Content Body with math-optimized padding */}
      <div className={cn("p-6 md:p-8 flex-1 flex flex-col justify-between", imageSrc ? "pt-5 md:pt-6" : "")}>
        <div className="space-y-4">
          {/* Header block with Badge (if no image) and Title/Subtitle */}
          {!imageSrc && badge && (
            <div className="mb-2">
              {badge}
            </div>
          )}

          {(title || subtitle) && (
            <div className="space-y-1.5">
              {title && (
                <div className="text-lg md:text-xl font-display font-semibold text-stone-950 leading-snug tracking-tight">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-xs md:text-sm text-stone-500 font-sans font-normal leading-relaxed">
                  {subtitle}
                </div>
              )}
            </div>
          )}

          {/* 3. Stat Block section */}
          {statValue !== undefined && (
            <div className="pt-2 space-y-2">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl md:text-4xl font-display font-bold text-stone-950 tracking-tight">
                  {statValue}
                </span>
                {statTrend && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border font-sans",
                      statTrend.type === "up" && "text-emerald-600 bg-emerald-50/50 border-emerald-100",
                      statTrend.type === "down" && "text-rose-600 bg-rose-50/50 border-rose-100",
                      statTrend.type === "neutral" && "text-stone-500 bg-stone-50 border-stone-200"
                    )}
                  >
                    {statTrend.type === "up" && <TrendingUp className="h-3 w-3" />}
                    {statTrend.type === "down" && <TrendingDown className="h-3 w-3" />}
                    {statTrend.type === "neutral" && <Minus className="h-3 w-3" />}
                    {statTrend.value}
                  </span>
                )}
              </div>
              {statLabel && (
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest font-sans">
                  {statLabel}
                </div>
              )}
            </div>
          )}

          {/* Additional Custom Children content */}
          {children && (
            <div className="text-xs md:text-sm text-stone-600 font-sans font-normal leading-relaxed space-y-2">
              {children}
            </div>
          )}
        </div>

        {/* 4. Footer Slot */}
        {footer && (
          <div className="mt-6 pt-5 border-t border-stone-100/80 flex items-center justify-between">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  const containerClasses = cn(
    "border border-stone-200/60 overflow-hidden transition-all duration-300 relative",
    radiusClasses[borderRadius],
    shadowClasses[shadowSize],
    bgClasses[backgroundColor],
    accentBorder && "border-l-4 border-l-[#C47D50]",
    onClick && "cursor-pointer select-none",
    className
  );

  // If clickable, wrap in a motion div with tap/hover scaling
  if (onClick) {
    return (
      <motion.div
        {...props}
        onClick={onClick}
        className={containerClasses}
        whileHover={hoverable ? { y: -4, scale: 1.005, borderColor: "rgba(196,125,80,0.4)" } : {}}
        whileTap={{ scale: 0.995 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={containerClasses} {...props}>
      {cardContent}
    </div>
  );
};
