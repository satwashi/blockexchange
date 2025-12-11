"use client";

import { PendingActions as PendingActionsType } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import {
  FileCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface PendingActionsProps {
  data: PendingActionsType;
}

interface ActionItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  href: string;
  variant: "warning" | "success" | "danger" | "info";
}

const ActionItem = ({ icon, label, count, href, variant }: ActionItemProps) => {
  const iconStyles = {
    warning: "text-amber-400",
    success: "text-emerald-400",
    danger: "text-red-400",
    info: "text-blue-400",
  };

  const countStyles = {
    warning: "bg-amber-500/15 text-amber-400",
    success: "bg-emerald-500/15 text-emerald-400",
    danger: "bg-red-500/15 text-red-400",
    info: "bg-blue-500/15 text-blue-400",
  };

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
        "hover:bg-accent/50 group border border-transparent hover:border-border/50"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center bg-muted/50",
            count > 0 && iconStyles[variant]
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            "font-medium text-sm",
            count > 0 ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {count > 0 ? (
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold min-w-[28px] text-center",
              countStyles[variant]
            )}
          >
            {count}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground px-2">—</span>
        )}
        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
};

export default function PendingActionsCard({ data }: PendingActionsProps) {
  const totalPending =
    data.pendingKyc +
    data.pendingWithdrawals +
    data.pendingDeposits +
    data.openSupportTickets;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Pending Actions</h3>
        {totalPending > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400">
            {totalPending} pending
          </span>
        )}
      </div>

      <div className="space-y-1">
        <ActionItem
          icon={<FileCheck className="w-4 h-4" />}
          label="KYC Reviews"
          count={data.pendingKyc}
          href="/dashboard/kyc"
          variant="warning"
        />
        <ActionItem
          icon={<ArrowUpFromLine className="w-4 h-4" />}
          label="Withdrawal Requests"
          count={data.pendingWithdrawals}
          href="/dashboard/transactions/withdrawals"
          variant="danger"
        />
        <ActionItem
          icon={<ArrowDownToLine className="w-4 h-4" />}
          label="Deposit Confirmations"
          count={data.pendingDeposits}
          href="/dashboard/transactions/deposits"
          variant="success"
        />
        <ActionItem
          icon={<MessageCircle className="w-4 h-4" />}
          label="Support Tickets"
          count={data.openSupportTickets}
          href="/chat"
          variant="info"
        />
      </div>
    </div>
  );
}
