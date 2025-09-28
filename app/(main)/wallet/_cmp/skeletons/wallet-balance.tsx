import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure this exists

export const WalletBalanceSkeleton = () => {
  return (
    <Card className="bg-secondary border-0 mb-8">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {/* Icon circle */}
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" /> {/* "Your Total Asset" */}
            <Skeleton className="h-3 w-20" /> {/* "X Assets" */}
          </div>
        </div>

        {/* Balance & 24h change */}
        <div className="space-y-4">
          {/* Big balance number */}
          <Skeleton className="h-10 md:h-12 w-48" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" /> {/* change badge */}
            <Skeleton className="h-4 w-24" /> {/* "Last 24 hours" */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
