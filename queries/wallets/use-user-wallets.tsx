"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import supabase from "@/lib/client";
import getUserWallets from "@/server/wallets/get-user-wallets";

export const useUserWallets = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: wallets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user_wallets", userId],
    queryFn: () => getUserWallets(userId),
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("wallets-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallets",
          filter: `user_id=eq.${userId}`, // only listen for this user
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["wallets", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const walletList = wallets ?? [];

  const mockPrices: Record<string, number> = {
    BTC: 42750.0,
    ETH: 2580.5,
    USDT: 1.0,
    ADA: 0.485,
    SOL: 98.75,
  };

  const totalBalance = walletList.reduce((sum, wallet) => {
    console.log(wallet.wallet_type);
    const price = mockPrices[wallet.wallet_type] || 0;
    return sum + wallet.balance * price;
  }, 0);

  const totalChange24h = walletList.length
    ? walletList.reduce((sum, wallet) => sum + (wallet?.change24h || 0), 0) /
      walletList.length
    : 0;

  const totalAssets = walletList.length;

  return {
    wallets,
    totalBalance,
    totalAssets,
    totalChange24h,
    isLoading,
    error,
  };
};
