"use client";

import { cn } from "@/lib/utils";
import {
  Inbox,
  FileX2,
  Search,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  FilterX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateVariant = 
  | "orders-all"
  | "orders-open"
  | "orders-closed"
  | "transactions-all"
  | "transactions-deposit"
  | "transactions-withdraw"
  | "search"
  | "generic";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, {
  icon: React.ElementType;
  iconClass: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}> = {
  "orders-all": {
    icon: TrendingUp,
    iconClass: "text-primary",
    title: "No orders yet",
    description: "Start trading to see your orders here. Your trading history will appear once you place your first trade.",
    actionLabel: "Start Trading",
    actionHref: "/trading",
  },
  "orders-open": {
    icon: FilterX,
    iconClass: "text-blue-500",
    title: "No open orders",
    description: "You don't have any active trades right now. Open orders will appear here while they're running.",
    actionLabel: "Place a Trade",
    actionHref: "/trading",
  },
  "orders-closed": {
    icon: FileX2,
    iconClass: "text-muted-foreground",
    title: "No closed orders",
    description: "Completed trades will appear here. Once your open orders finish, you'll see the results.",
  },
  "transactions-all": {
    icon: Inbox,
    iconClass: "text-primary",
    title: "No transactions yet",
    description: "Your deposit and withdrawal history will appear here once you make your first transaction.",
    actionLabel: "Make a Deposit",
    actionHref: "/wallet",
  },
  "transactions-deposit": {
    icon: ArrowDownToLine,
    iconClass: "text-emerald-500",
    title: "No deposits found",
    description: "You haven't made any deposits yet. Deposit funds to start trading on the platform.",
    actionLabel: "Deposit Now",
    actionHref: "/wallet",
  },
  "transactions-withdraw": {
    icon: ArrowUpFromLine,
    iconClass: "text-amber-500",
    title: "No withdrawals found",
    description: "You haven't made any withdrawal requests. Your withdrawal history will appear here.",
  },
  "search": {
    icon: Search,
    iconClass: "text-muted-foreground",
    title: "No results found",
    description: "Try adjusting your search or filter to find what you're looking for.",
  },
  "generic": {
    icon: Inbox,
    iconClass: "text-muted-foreground",
    title: "Nothing here yet",
    description: "This section is empty. Check back later or try a different filter.",
  },
};

export default function EmptyState({
  variant = "generic",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionLabel = actionLabel || config.actionLabel;
  const finalActionHref = actionHref || config.actionHref;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {/* Animated icon container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl scale-150 animate-pulse" />
        <div
          className={cn(
            "relative w-20 h-20 rounded-2xl flex items-center justify-center",
            "bg-gradient-to-br from-muted/80 to-muted/40 border border-border/50",
            "shadow-lg shadow-black/5"
          )}
        >
          <Icon className={cn("w-10 h-10", config.iconClass)} strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {finalTitle}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {finalDescription}
      </p>

      {/* Action button */}
      {(finalActionLabel && finalActionHref) || onAction ? (
        finalActionHref ? (
          <Link href={finalActionHref}>
            <Button variant="default" size="sm" className="gap-2">
              {finalActionLabel}
            </Button>
          </Link>
        ) : (
          <Button variant="default" size="sm" onClick={onAction} className="gap-2">
            {finalActionLabel}
          </Button>
        )
      ) : null}

      {/* Filter hint */}
      {(variant.includes("open") || variant.includes("closed") || variant.includes("deposit") || variant.includes("withdraw")) && (
        <p className="text-xs text-muted-foreground/70 mt-4">
          💡 Try switching to a different tab to see more results
        </p>
      )}
    </div>
  );
}


