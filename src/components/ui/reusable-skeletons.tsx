import React from "react";

/**
 * Base skeleton pulsing bar matching the off-white high-contrast theme of Grupo Comunicarte.
 */
export const BaseSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div 
      className={`animate-pulse bg-stone-200/80 rounded-lg ${className || "h-4 w-full"}`} 
    />
  );
};

/**
 * Skeleton loader for standard KPI Dashboard Metrics.
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 border border-stone-200/60 rounded-2xl space-y-3 relative overflow-hidden shadow-3xs">
      <div className="flex items-center justify-between">
        <BaseSkeleton className="h-3.5 w-16 bg-stone-150" />
        <BaseSkeleton className="h-6 w-6 rounded-md bg-stone-100" />
      </div>
      <BaseSkeleton className="h-7 w-24 bg-stone-200" />
      <BaseSkeleton className="h-3 w-32 bg-stone-100" />
    </div>
  );
};

/**
 * Skeleton loader for an individual Media screen card (DOOH Screen).
 */
export const MediaCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-3xs flex flex-col space-y-4 p-4 relative text-left">
      {/* Upper simulated screen preview / map block */}
      <div className="h-44 w-full rounded-xl bg-stone-200/65 animate-pulse relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-stone-200/50 via-stone-100/30 to-stone-200/50" />
        <div className="h-8 w-12 rounded-md bg-stone-100/50 animate-pulse" />
      </div>
      
      {/* Name, Zone, details */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between">
          <BaseSkeleton className="h-4.5 w-1/2 bg-stone-200" />
          <BaseSkeleton className="h-5 w-16 rounded-full bg-stone-150" />
        </div>
        <BaseSkeleton className="h-3.5 w-1/3 bg-stone-150" />
        
        {/* Technical Specs blocks */}
        <div className="border-t border-stone-100 pt-3 flex items-center justify-between gap-1">
          <BaseSkeleton className="h-3.5 w-14 bg-stone-100" />
          <BaseSkeleton className="h-3.5 w-14 bg-stone-100" />
          <BaseSkeleton className="h-3.5 w-14 bg-stone-100" />
        </div>
      </div>

      {/* Interactive controls skeleton footer */}
      <div className="flex items-center gap-2 pt-1">
        <BaseSkeleton className="h-8.5 flex-1 rounded-xl bg-stone-150" />
        <BaseSkeleton className="h-8.5 w-8.5 rounded-xl bg-stone-100" />
      </div>
    </div>
  );
};

/**
 * Grid of DOOH media screen card skeletons.
 */
export const MediaGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <MediaCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Skeleton loader for list view tables (CRM client list, log lists).
 */
export const TableListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-5 space-y-4 shadow-3xs text-left">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <BaseSkeleton className="h-4.5 w-36 bg-stone-200" />
        <BaseSkeleton className="h-8 w-20 rounded-xl bg-stone-150" />
      </div>
      <div className="space-y-3.5">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <BaseSkeleton className="h-8 w-8 rounded-xl bg-stone-150 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <BaseSkeleton className="h-3.5 w-1/3 bg-stone-200" />
                <BaseSkeleton className="h-3 w-1/4 bg-stone-100" />
              </div>
            </div>
            <div className="flex gap-2">
              <BaseSkeleton className="h-5.5 w-14 rounded-lg bg-stone-150" />
              <BaseSkeleton className="h-5.5 w-10 rounded-lg bg-stone-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Loading state skeleton for user Forms.
 */
export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-6 space-y-5 shadow-3xs text-left">
      <BaseSkeleton className="h-4.5 w-44 bg-stone-200" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <BaseSkeleton className="h-3 w-24 bg-stone-150" />
            <BaseSkeleton className="h-9 w-full bg-stone-50 border border-stone-100 rounded-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
        <BaseSkeleton className="h-9 w-20 bg-stone-100" />
        <BaseSkeleton className="h-9 w-28 bg-[#06434a]/15" />
      </div>
    </div>
  );
};

/**
 * Specially designed bento-style loading grid for the AI Optimizer Campaign Report.
 * Perfect replacement for spinners during active LLM inference.
 */
export const AiReportSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-stone-200/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xs relative overflow-hidden text-left">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 via-amber-400 to-[#06434a] animate-pulse" />
      
      {/* Header section with sparkles mock */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-amber-400 animate-ping" />
            <BaseSkeleton className="h-3.5 w-48 bg-[#06434a]/20" />
          </div>
          <BaseSkeleton className="h-5.5 w-2/3 bg-stone-200" />
        </div>
        <BaseSkeleton className="h-9 w-24 bg-stone-150 rounded-xl shrink-0" />
      </div>

      {/* Campaign metrics blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-stone-50/50 border border-stone-100 p-4 rounded-xl space-y-2">
            <BaseSkeleton className="h-3 w-20 bg-stone-150" />
            <BaseSkeleton className="h-6 w-16 bg-stone-200" />
          </div>
        ))}
      </div>

      {/* Media Recommendation rows */}
      <div className="space-y-3.5">
        <BaseSkeleton className="h-4.5 w-36 bg-stone-200" />
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-stone-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <BaseSkeleton className="h-4 w-36 bg-stone-200" />
                  <BaseSkeleton className="h-3.5 w-14 rounded-full bg-stone-100" />
                </div>
                <BaseSkeleton className="h-3 w-1/2 bg-stone-150" />
              </div>
              <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                <div className="space-y-1">
                  <BaseSkeleton className="h-3 w-12 bg-stone-150" />
                  <BaseSkeleton className="h-3.5 w-16 bg-stone-200" />
                </div>
                <BaseSkeleton className="h-7 w-7 rounded-full bg-stone-100 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights reasoning blocks */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100">
        <BaseSkeleton className="h-4 w-28 bg-stone-200" />
        <BaseSkeleton className="h-3 w-full bg-stone-150" />
        <BaseSkeleton className="h-3 w-11/12 bg-stone-100" />
      </div>
    </div>
  );
};

/**
 * Premium full screen application shell skeleton representing mock navigation, sidebars,
 * and high-fidelity panel layouts. Immediate modern response for initial page loads.
 */
export const DashboardAppShellSkeleton: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF9F5] font-sans text-left">
      
      {/* 1. Sidebar Skeleton */}
      <div className="w-64 border-r border-stone-200 bg-white hidden lg:flex flex-col justify-between shrink-0">
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 border-b border-stone-100 flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-[#06434a]/25 animate-pulse shrink-0" />
            <div className="space-y-1.5 flex-1">
              <BaseSkeleton className="h-3.5 w-28 bg-stone-200" />
              <BaseSkeleton className="h-2 w-16 bg-stone-150" />
            </div>
          </div>
          {/* Navigation link placeholders */}
          <div className="p-4 space-y-4">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 py-1">
                <BaseSkeleton className="h-4 w-4 rounded-md bg-stone-150 shrink-0" />
                <BaseSkeleton className="h-3 w-20 bg-stone-150" />
              </div>
            ))}
          </div>
        </div>
        {/* Profile indicator footer */}
        <div className="p-4 border-t border-stone-100 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse shrink-0" />
          <div className="space-y-1">
            <BaseSkeleton className="h-3 w-16 bg-stone-150" />
            <BaseSkeleton className="h-2.5 w-24 bg-stone-100" />
          </div>
        </div>
      </div>

      {/* 2. Content view skeleton */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header navbar */}
        <header className="h-16 bg-white border-b border-stone-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 lg:hidden">
            <BaseSkeleton className="h-8 w-8 rounded-lg bg-stone-150" />
            <BaseSkeleton className="h-4.5 w-24 bg-stone-200" />
          </div>
          <div className="hidden lg:block">
            <BaseSkeleton className="h-4.5 w-44 bg-stone-150" />
          </div>
          <div className="flex items-center gap-3">
            <BaseSkeleton className="h-8 w-24 rounded-full bg-stone-150" />
            <div className="h-8 w-8 rounded-full bg-stone-200 animate-pulse shrink-0" />
          </div>
        </header>

        {/* Content workspace wrapper */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#FAF9F5]">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <BaseSkeleton className="h-5.5 w-48 bg-stone-200" />
              <BaseSkeleton className="h-3.5 w-72 bg-stone-150" />
            </div>
            <BaseSkeleton className="h-9 w-28 bg-stone-200 rounded-xl shrink-0" />
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white p-5 border border-stone-200/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <BaseSkeleton className="h-3.5 w-16 bg-stone-150" />
                  <BaseSkeleton className="h-6 w-6 rounded-md bg-stone-100" />
                </div>
                <BaseSkeleton className="h-7 w-20 bg-stone-200" />
                <BaseSkeleton className="h-3 w-28 bg-stone-100" />
              </div>
            ))}
          </div>

          {/* Split lists layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TableListSkeleton rows={4} />
            </div>
            <div>
              <div className="bg-white border border-stone-200/60 rounded-2xl p-5 space-y-4">
                <BaseSkeleton className="h-4.5 w-24 bg-stone-200" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <BaseSkeleton className="h-8 w-8 rounded-full bg-stone-150 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <BaseSkeleton className="h-3 w-full bg-stone-100" />
                        <BaseSkeleton className="h-2.5 w-1/2 bg-stone-50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
