import React from "react";
import { Skeleton } from "../ui/skeleton";

interface InventorySkeletonProps {
  count?: number;
}

export const InventorySkeleton: React.FC<InventorySkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full" id="inventory-skeletons">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-stone-200 p-5 rounded-2xl space-y-4 flex flex-col justify-between"
          id={`inventory-skeleton-card-${index}`}
        >
          <div className="space-y-2.5">
            {/* Badges line */}
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4.5 w-24 rounded-full" />
              <Skeleton className="h-4.5 w-16 rounded-md" />
            </div>

            {/* Title and location */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-4/5 rounded-md" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3.5 w-32 rounded-md" />
              </div>
            </div>
          </div>

          {/* Pricing & impacts summary skeleton */}
          <div className="border-t border-stone-150 pt-3 flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-3 w-12 rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-md font-mono" />
            </div>

            <div className="space-y-1 flex flex-col items-end">
              <Skeleton className="h-3 w-10 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-md font-mono" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="border-t border-stone-150 pt-3 flex items-center justify-end gap-1.5">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
