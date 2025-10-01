"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/client";
import getMyTransactions from "@/server/transactions/get-my-transactions";
import type { Transaction } from "@/types/transactions";

export default function useMyTransactions() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["my-transactions"],
    queryFn: () => getMyTransactions(),
  });

  useEffect(() => {
    const channel = supabase
      .channel("transactions-realtime-my")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => queryClient.invalidateQueries({ queryKey: ["my-transactions"] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const deposits = (data || []).filter((t) => t.transaction_type === "deposit");
  const withdrawals = (data || []).filter(
    (t) => t.transaction_type === "withdraw"
  );

  return { transactions: data || [], deposits, withdrawals, isLoading, error };
}
