"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoinListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="rounded-2xl animate-pulse">
          <CardContent className="flex items-center justify-between p-4">
            {/* Left: icon + name */}
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="w-20 h-4 rounded" />
                <Skeleton className="w-14 h-3 rounded" />
              </div>
            </div>

            {/* Middle: price */}
            <div className="text-right space-y-1">
              <Skeleton className="w-16 h-5 rounded" />
            </div>

            {/* Right: 24h change */}
            <div className="space-y-1">
              <Skeleton className="w-12 h-4 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
