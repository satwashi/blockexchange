"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import supabase from "@/lib/client";
import getUserWallets from "@/server/wallets/get-user-wallets";
import useCoins from "../coins/use-coins";
import { decimalAdd, decimalMul } from "@/utils/crypto/arthimetic";

export const useUserWallets = (userId: string) => {
  const queryClient = useQueryClient();
  const { coins } = useCoins();

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

    // ✅ return a normal function; handle async inside
    return () => {
      // we can ignore the returned promise or log it
      supabase.removeChannel(channel).catch(console.error);
    };
  }, [userId, queryClient]);

  const walletList = wallets ?? [];

  // build a lookup of symbol -> coin data
  const coinMap: Record<string, (typeof coins)[number]> = {};
  coins?.forEach((c) => (coinMap[c.symbol.toUpperCase()] = c));

  let totalCurrent = new Decimal(0);
  let totalPrev24h = new Decimal(0);

  // ✅ attach change24h % to each wallet
  const walletsWithChange = walletList.map((wallet) => {
    const coin = coinMap[wallet.wallet_type.toUpperCase()];
    if (!coin) return { ...wallet, change24h: 0 };

    const priceNow = new Decimal(coin.price);
    const valueNow = decimalMul(wallet.balance, priceNow);
    totalCurrent = decimalAdd(totalCurrent, valueNow);

    // value 24h ago = current value / (1 + change24h/100)
    const value24hAgo = valueNow.div(
      new Decimal(1).add(new Decimal(coin.change24h).div(100))
    );
    totalPrev24h = decimalAdd(totalPrev24h, value24hAgo);

    // wallet’s own % change
    const walletChange24h = value24hAgo.gt(0)
      ? valueNow.minus(value24hAgo).div(value24hAgo).mul(100).toNumber()
      : 0;

    return {
      ...wallet,
      change24h: walletChange24h,
    };
  });

  const totalBalance = totalCurrent.toNumber();

  const totalChange24h = totalPrev24h.gt(0)
    ? totalCurrent.minus(totalPrev24h).div(totalPrev24h).mul(100).toNumber()
    : 0;

  const totalAssets = walletList.length;

  return {
    wallets: walletsWithChange, // ✅ every wallet now has its own change24h %
    totalBalance,
    totalAssets,
    totalChange24h, // portfolio-wide change
    isLoading,
    error,
  };
};
