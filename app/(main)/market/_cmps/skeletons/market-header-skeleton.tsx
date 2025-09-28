import { Skeleton } from "@/components/ui/skeleton";

export function MarketHeaderSkeleton() {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 animate-pulse">
      <div className="container mx-auto px-4 py-6">
        {/* Search input skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Market Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-card/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                {/* Icon placeholder */}
                <Skeleton className="h-10 w-10 rounded-full" />

                {/* Text placeholders */}
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-6 w-1/2 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
