"use client";

import useMyTransactions from "@/queries/transactions/use-my-transactions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Main({ user_id }: { user_id: string }) {
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
              <Card key={i} className="h-24 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-6">Failed to load transactions.</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:inline-grid">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposit">Deposits</TabsTrigger>
            <TabsTrigger value="withdraw">Withdrawals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TransactionList items={transactions} />
          </TabsContent>
          <TabsContent value="deposit">
            <TransactionList items={deposits} />
          </TabsContent>
          <TabsContent value="withdraw">
            <TransactionList items={withdrawals} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TransactionList({ items }: { items: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-6 text-muted-foreground">No transactions yet.</div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((tx) => (
        <Card key={tx.id} className="border border-border/50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                {tx.wallet_type}
              </div>
              <div className="text-lg font-semibold">
                {tx.amount} {tx.wallet_type}
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(tx.created_at).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="capitalize mb-2">
                {tx.transaction_type}
              </Badge>
              <Badge
                variant={
                  tx.status === "verified"
                    ? "default"
                    : tx.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize"
              >
                {tx.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
