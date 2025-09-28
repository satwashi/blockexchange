"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/client";
import getAllTansactions from "@/server/transactions/admin/get-all-transactions";
import { Transaction } from "@/types/transactions";

export const useAllTransactions = () => {
  const queryClient = useQueryClient();

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-transactions"],
    queryFn: () => getAllTansactions(),
  });

  // Separate deposits and withdrawals
  const deposits = useMemo(
    () =>
      transactions?.filter(
        (tx: Transaction) => tx.transaction_type === "deposit"
      ) || [],
    [transactions]
  );
  const withdrawals = useMemo(
    () =>
      transactions?.filter(
        (tx: Transaction) => tx.transaction_type === "withdraw"
      ) || [],
    [transactions]
  );

  useEffect(() => {
    const channel = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    transactions,
    deposits,
    withdrawals,
    isLoading,
    error,
  };
};
