"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CoinListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-full flex items-center justify-between rounded-xl px-3 py-2 bg-transparent border border-border/20"
        >
          {/* Left: Icon + Name */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Middle: Price */}
          <Skeleton className="h-5 w-20 rounded-md" />

          {/* Right: 24h Change */}
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
