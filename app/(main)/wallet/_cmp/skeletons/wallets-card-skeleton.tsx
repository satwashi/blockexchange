import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const WalletCardSkeleton = () => {
  return (
    <Card className="group bg-secondary border border-border/50">
      <CardContent className="p-6 space-y-4">
        {/* Top header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" /> {/* wallet_type */}
              <Skeleton className="h-3 w-20" /> {/* name */}
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" /> {/* 24h badge */}
        </div>
        {/* Balance */}
        <Skeleton className="h-6 w-40" />

        {/* Address box */}
        <div className="border rounded-lg p-3">
          <Skeleton className="h-3 w-12 mb-1" /> {/* Address label */}
          <Skeleton className="h-4 w-32" /> {/* truncated address */}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-8 w-24 rounded-md" /> {/* Deposit */}
          <Skeleton className="h-8 w-24 rounded-md" /> {/* Withdraw */}
        </div>
      </CardContent>
    </Card>
  );
};
