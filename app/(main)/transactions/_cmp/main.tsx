"use client";

import useMyTransactions from "@/queries/transactions/use-my-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WalletIcon } from "@/components/shared/pair-icon";
import EmptyState from "@/components/shared/empty-state";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistance } from "date-fns";

export default function Main() {
  const { transactions, deposits, withdrawals, isLoading, error } =
    useMyTransactions();
  const searchParams = useSearchParams();
  const initialTab = useMemo(() => {
    const q = (searchParams.get("transaction") || "").toLowerCase();
    if (q === "deposit" || q === "deposite") return "deposit";
    if (q === "withdraw" || q === "withdrawal") return "withdraw";
    return "all";
  }, [searchParams]);
  const [tab, setTab] = useState<string>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="h-32 animate-pulse bg-muted/50 border-border/50"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-6 text-center text-muted-foreground">
        Failed to load transactions.
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:inline-grid mb-6 bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposit">Deposits</TabsTrigger>
            <TabsTrigger value="withdraw">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TransactionList items={transactions} filter="all" />
          </TabsContent>
          <TabsContent value="deposit">
            <TransactionList items={deposits} filter="deposit" />
          </TabsContent>
          <TabsContent value="withdraw">
            <TransactionList items={withdrawals} filter="withdraw" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface Transaction {
  id: string;
  wallet_type: string;
  amount: number;
  transaction_type: "deposit" | "withdraw";
  status: "pending" | "verified" | "failed";
  created_at: string;
}

interface TransactionListProps {
  items: Transaction[];
  filter?: "all" | "deposit" | "withdraw";
}

function TransactionList({ items, filter = "all" }: TransactionListProps) {
  if (!items || items.length === 0) {
    const variant = filter === "deposit"
      ? "transactions-deposit"
      : filter === "withdraw"
        ? "transactions-withdraw"
        : "transactions-all";

    return <EmptyState variant={variant} />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((tx) => (
        <TransactionCard key={tx.id} tx={tx} />
      ))}
    </div>
  );
}

function TransactionCard({ tx }: { tx: Transaction }) {
  const isDeposit = tx.transaction_type === "deposit";

  const statusConfig = {
    pending: {
      icon: AlertCircle,
      class: "bg-amber-500/15 text-amber-500",
      dotClass: "bg-amber-500 animate-pulse",
    },
    verified: {
      icon: CheckCircle2,
      class: "bg-emerald-500/15 text-emerald-500",
      dotClass: "bg-emerald-500",
    },
    failed: {
      icon: XCircle,
      class: "bg-red-500/15 text-red-500",
      dotClass: "bg-red-500",
    },
  };

  const config = statusConfig[tx.status] || statusConfig.pending;

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Main Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Left: Icon and Amount */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <WalletIcon walletType={tx.wallet_type} size="lg" />
                {/* Type indicator */}
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background",
                    isDeposit ? "bg-emerald-500" : "bg-amber-500"
                  )}
                >
                  {isDeposit ? (
                    <ArrowDownToLine className="w-3 h-3 text-white" />
                  ) : (
                    <ArrowUpFromLine className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">
                  {tx.amount?.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-1.5">
                    {tx.wallet_type}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground capitalize">
                  {tx.transaction_type}
                </div>
              </div>
            </div>

            {/* Right: Status */}
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                config.class
              )}
            >
              <span
                className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.dotClass)}
              />
              {tx.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border/50 bg-muted/20">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              {formatDistance(new Date(tx.created_at), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
