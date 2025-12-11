"use client";

import { useSession } from "@/queries/useSession";
import DashboardOverview from "./_cmp/dashboard-overview";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6">
      <DashboardOverview />
    </div>
  );
};

export default DashboardPage;
