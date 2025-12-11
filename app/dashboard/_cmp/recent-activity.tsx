"use client";

import { RecentActivity as RecentActivityType } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import {
  UserPlus,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  activities: RecentActivityType[];
}

const formatAmount = (amount?: number) => {
  if (amount === undefined) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getActivityIcon = (type: RecentActivityType["type"]) => {
  const iconMap = {
    signup: <UserPlus className="w-4 h-4" />,
    trade: <TrendingUp className="w-4 h-4" />,
    deposit: <ArrowDownToLine className="w-4 h-4" />,
    withdrawal: <ArrowUpFromLine className="w-4 h-4" />,
    kyc: <FileCheck className="w-4 h-4" />,
  };
  return iconMap[type];
};

const getActivityStyles = (type: RecentActivityType["type"]) => {
  const styleMap = {
    signup: "text-blue-400",
    trade: "text-primary",
    deposit: "text-emerald-400",
    withdrawal: "text-amber-400",
    kyc: "text-purple-400",
  };
  return styleMap[type];
};

export default function RecentActivityCard({
  activities,
}: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-1">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              "hover:bg-accent/50 border border-transparent hover:border-border/50",
              index === 0 && "bg-accent/30"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center bg-muted/50 shrink-0",
                getActivityStyles(activity.type)
              )}
            >
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground truncate">
                  {activity.userName}
                </span>
                {activity.amount !== undefined && (
                  <span className="text-xs font-semibold text-emerald-400">
                    {formatAmount(activity.amount)}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {activity.description}
              </p>
            </div>

            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
