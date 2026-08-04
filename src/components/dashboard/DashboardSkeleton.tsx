import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div id="dashboard-skeleton" className="p-6 md:p-8 space-y-8 animate-pulse bg-[#FAF9F5] min-h-full">
      {/* 1. Header Skeletons */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-stone-200 rounded-lg"></div>
          <div className="h-3.5 w-80 bg-stone-150 rounded-lg"></div>
        </div>
        <div className="h-10 w-28 bg-stone-200 rounded-full"></div>
      </div>

      {/* 2. Stat Cards Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 border border-stone-200/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-12 bg-stone-150 rounded-md"></div>
              <div className="h-7 w-7 rounded-lg bg-stone-100"></div>
            </div>
            <div className="h-8 w-24 bg-stone-200 rounded-lg"></div>
            <div className="h-3.5 w-32 bg-stone-150 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* 3. Main Split View Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Larger Table/List */}
        <div className="lg:col-span-2 bg-white p-6 border border-stone-200/60 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="h-5 w-36 bg-stone-200 rounded-md"></div>
            <div className="h-8 w-20 bg-stone-150 rounded-full"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-2/5 bg-stone-200 rounded"></div>
                  <div className="h-3.5 w-1/4 bg-stone-150 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-stone-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Actions / Logs */}
        <div className="bg-white p-6 border border-stone-200/60 rounded-2xl space-y-4">
          <div className="h-5 w-24 bg-stone-200 rounded-md"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-stone-200 shrink-0"></div>
                <div className="space-y-1.5 flex-1 mt-1">
                  <div className="h-3.5 w-full bg-stone-150 rounded"></div>
                  <div className="h-3 w-1/2 bg-stone-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
