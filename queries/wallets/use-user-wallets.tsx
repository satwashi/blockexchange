"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/client";
import getUserWallets from "@/server/wallets/get-user-wallets";
import { decimalAdd, decimalMul } from "@/utils/crypto/arthimetic";
import useCoins from "../coins/use-coins";
import Decimal from "decimal.js";

export const useUserWallets = (userId: string) => {
  const queryClient = useQueryClient();
  const { coins } = useCoins(); // all live coin data

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
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["user_wallets", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const walletList = wallets ?? [];

  // ✅ Map symbols to their current USDT price
  const priceMap: Record<string, number> = {};
  coins?.forEach((c) => {
    priceMap[c.symbol.toUpperCase()] = c.price; // e.g. { BTC: 42000, ETH: ... }
  });

  // ✅ Compute total balance with Decimal.js
  const totalBalance = walletList
    .reduce((sum, wallet) => {
      const price = priceMap[wallet.wallet_type.toUpperCase()] || 0;
      return decimalAdd(sum, decimalMul(wallet.balance, price));
    }, new Decimal(0))
    .toNumber();

  const totalChange24h = walletList.length
    ? walletList.reduce((s, w) => s + (w?.change24h || 0), 0) /
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
