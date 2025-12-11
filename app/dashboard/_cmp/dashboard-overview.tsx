"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentActivity,
} from "@/server/dashboard/get-dashboard-stats";
import StatsCard from "./stats-card";
import PendingActionsCard from "./pending-actions";
import RecentActivityCard from "./recent-activity";
import { useSession } from "@/queries/useSession";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  Wallet,
  UserPlus,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

// Skeleton loader for stats cards
const StatsCardSkeleton = () => (
  <div className="rounded-xl border border-border/50 bg-card/50 p-6">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-9 w-32 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-28" />
    </div>
  </div>
);

const PendingActionsSkeleton = () => (
  <div className="rounded-xl border border-border/50 bg-card/50 p-6">
    <Skeleton className="h-6 w-32 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const RecentActivitySkeleton = () => (
  <div className="rounded-xl border border-border/50 bg-card/50 p-6">
    <Skeleton className="h-6 w-32 mb-4" />
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export default function DashboardOverview() {
  const { user } = useSession();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
    refetchInterval: 30000,
    retry: 1,
  });

  const {
    data: activities,
    isLoading: activitiesLoading,
    error: activitiesError,
  } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => getRecentActivity(),
    refetchInterval: 15000,
    retry: 1,
  });

  // Debug logging
  if (statsError) {
    console.error("Dashboard stats error:", statsError);
  }
  if (activitiesError) {
    console.error("Recent activity error:", activitiesError);
  }

  // Calculate percentage changes from trends
  const calculateChange = (trend?: { value: number }[]) => {
    if (!trend || trend.length < 2) return 0;
    const current = trend[trend.length - 1].value;
    const previous = trend[trend.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome back, {user?.name || "Admin"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live data</span>
        </div>
      </div>

      {/* Primary Stats Grid - 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : stats ? (
          <>
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats.revenue.monthlyFees)}
              changePercent={calculateChange(stats.trends.volume) * 0.001}
              description="Trending up this month"
              subtitle="Platform fees for the last 30 days"
              icon={<DollarSign className="w-4 h-4" />}
            />
            <StatsCard
              title="Total Users"
              value={formatNumber(stats.users.totalUsers)}
              changePercent={
                stats.users.newUsersThisWeek > 0
                  ? (stats.users.newUsersThisWeek / Math.max(stats.users.totalUsers - stats.users.newUsersThisWeek, 1)) * 100
                  : 0
              }
              description={
                stats.users.newUsersThisWeek > 0
                  ? `+${stats.users.newUsersThisWeek} this week`
                  : "Stable user base"
              }
              subtitle="Total registered users (excluding admins)"
              icon={<Users className="w-4 h-4" />}
            />
            <StatsCard
              title="Active Traders"
              value={formatNumber(stats.users.activeTraders7d)}
              changePercent={
                stats.users.activeTraders24h > 0
                  ? (stats.users.activeTraders24h / Math.max(stats.users.activeTraders7d, 1)) * 100
                  : 0
              }
              description="Strong user retention"
              subtitle={`${stats.users.activeTraders24h} active today`}
              icon={<Zap className="w-4 h-4" />}
              variant="success"
            />
            <StatsCard
              title="Trading Volume"
              value={formatCurrency(stats.volume.monthlyVolume)}
              changePercent={calculateChange(stats.trends.volume)}
              description={
                calculateChange(stats.trends.volume) >= 0
                  ? "Steady performance"
                  : "Needs attention"
              }
              subtitle={`${formatNumber(stats.volume.totalTrades)} total trades`}
              icon={<BarChart3 className="w-4 h-4" />}
            />
          </>
        ) : (
          <div className="col-span-2 text-center py-12 rounded-xl border border-border/50 bg-card/50">
            <p className="text-muted-foreground">Failed to load statistics</p>
            {statsError && (
              <p className="text-xs text-red-500 mt-2">
                Error:{" "}
                {statsError instanceof Error
                  ? statsError.message
                  : "Unknown error"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/50 p-4"
              >
                <Skeleton className="h-3 w-16 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </>
        ) : stats ? (
          <>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Daily Volume</p>
              <p className="text-lg font-semibold">
                {formatCurrency(stats.volume.dailyVolume)}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">
                Weekly Volume
              </p>
              <p className="text-lg font-semibold">
                {formatCurrency(stats.volume.weeklyVolume)}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">New Today</p>
              <p className="text-lg font-semibold">
                +{stats.users.newUsersToday}
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 hover:bg-card/80 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">Daily Fees</p>
              <p className="text-lg font-semibold">
                {formatCurrency(stats.revenue.dailyFees)}
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Pending Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statsLoading ? (
          <>
            <PendingActionsSkeleton />
            <RecentActivitySkeleton />
          </>
        ) : (
          <>
            {stats && <PendingActionsCard data={stats.pending} />}
            {activitiesLoading ? (
              <RecentActivitySkeleton />
            ) : (
              <RecentActivityCard activities={activities || []} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
