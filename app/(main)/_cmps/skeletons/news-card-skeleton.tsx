"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsCardSkeleton() {
  return (
    <Card className="w-[350px] overflow-hidden bg-gradient-card border-border/50 shadow-card">
      <CardContent className="p-0">
        {/* Image skeleton */}
        <div className="relative h-48 w-[350px] mx-auto">
          <Skeleton className="w-[350px] h-full" />
        </div>

        <div className="p-6 space-y-4">
          {/* Categories skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />

          {/* Body skeleton */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />

          {/* Tags skeleton */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
