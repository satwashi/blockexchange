"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CryptoMarketSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border animate-pulse">
      {/* Desktop Table Header */}
      <div className="bg-table-header hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
        <div className="col-span-1 flex items-center justify-center">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="col-span-2">
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
        <div className="col-span-7 grid grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>
        <div className="col-span-1">
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
      </div>

      {/* Desktop & Mobile Rows */}
      <div className="bg-card">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="border-b border-border/50 p-4 md:grid md:grid-cols-12 gap-4"
          >
            {/* Desktop Row */}
            <div className="hidden md:flex items-center gap-3 col-span-12">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>

            {/* Mobile Card */}
            <div className="flex flex-col md:hidden space-y-3">
              <div className="flex justify-between items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-md flex-1" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
              <div className="flex justify-between gap-4">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
