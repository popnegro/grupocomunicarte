import React from "react";
import { AlertTriangle, Info } from "lucide-react";
import { Skeleton } from "../../ui/skeleton";

interface LoadingStateProps {
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    ))}
  </>
);

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => (
  <div className="text-center text-xs text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
    <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
    Error: {message}
  </div>
);

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="text-center text-xs text-stone-500 bg-stone-50 p-4 rounded-lg border border-stone-100">
    <Info className="h-5 w-5 mx-auto mb-1" />
    {message}
  </div>
);
