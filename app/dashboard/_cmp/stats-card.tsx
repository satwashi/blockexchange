"use client";

import { TrendDataPoint } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: TrendDataPoint[];
  changePercent?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

// Trend badge component
const TrendBadge = ({ percent }: { percent: number }) => {
  const isPositive = percent >= 0;
  
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        isPositive
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      )}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      <span>
        {isPositive ? "+" : ""}
        {percent.toFixed(1)}%
      </span>
    </div>
  );
};

export default function StatsCard({
  title,
  value,
  subtitle,
  description,
  icon,
  changePercent,
  variant = "default",
}: StatsCardProps) {
  const variantStyles = {
    default: "border-border/50",
    success: "border-emerald-500/20",
    warning: "border-amber-500/20",
    danger: "border-red-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-6 transition-all duration-300",
        "hover:bg-card/80 hover:shadow-lg hover:shadow-black/10 hover:border-border",
        variantStyles[variant]
      )}
    >
      {/* Header with title and trend badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="text-muted-foreground">
              {icon}
            </div>
          )}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {changePercent !== undefined && <TrendBadge percent={changePercent} />}
      </div>

      {/* Main value */}
      <div className="mb-4">
        <h3 className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </h3>
      </div>

      {/* Description and subtitle */}
      <div className="space-y-1">
        {description && (
          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
            {description}
            {changePercent !== undefined && changePercent >= 0 && (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            )}
            {changePercent !== undefined && changePercent < 0 && (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
          </p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
