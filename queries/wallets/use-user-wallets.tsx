import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import supabase from "@/lib/client";
import getUserWallets from "@/server/wallets/get-user-wallets";
import useCoins from "../coins/use-coins";
import { decimalAdd, decimalMul, decimalDiv } from "@/utils/crypto/arthimetic";

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
        () =>
          queryClient.invalidateQueries({ queryKey: ["user_wallets", userId] })
      )
      .subscribe();

    return () => {
      // ✅ non-async cleanup function
      supabase.removeChannel(channel).catch((err) => console.error(err));
    };
  }, [userId, queryClient]);

  const walletList = wallets ?? [];

  // Build coin lookup map
  const coinMap: Record<string, (typeof coins)[number]> = {};
  coins?.forEach((c) => (coinMap[c.symbol.toUpperCase()] = c));

  let totalCurrent = new Decimal(0);
  let totalPrev24h = new Decimal(0);

  const walletsWithChange = walletList.map((wallet) => {
    const coin = coinMap[wallet.wallet_type.toUpperCase()];
    if (!coin) return { ...wallet, change24h: 0 };

    const priceNow = new Decimal(coin.price);
    const valueNow = decimalMul(wallet.balance, priceNow);
    totalCurrent = decimalAdd(totalCurrent, valueNow);

    const value24hAgo = valueNow.div(
      new Decimal(1).add(new Decimal(coin.change24h).div(100))
    );
    totalPrev24h = decimalAdd(totalPrev24h, value24hAgo);

    const walletChange24h = value24hAgo.gt(0)
      ? valueNow.minus(value24hAgo).div(value24hAgo).mul(100).toNumber()
      : 0;

    return { ...wallet, change24h: walletChange24h };
  });

  const totalBalance = totalCurrent.toNumber();
  const totalChange24h = totalPrev24h.gt(0)
    ? totalCurrent.minus(totalPrev24h).div(totalPrev24h).mul(100).toNumber()
    : 0;

  const btcPrice = coinMap["BTC"]?.price || 0;
  const ethPrice = coinMap["ETH"]?.price || 0;
  const bnbPrice = coinMap["BNB"]?.price || 0;
  const usdtPrice = coinMap["USDT"]?.price || 1;
  const solPrice = coinMap["SOL"]?.price || 0;

  const totals = {
    BTC:
      btcPrice > 0
        ? decimalDiv(totalCurrent, new Decimal(btcPrice)).toNumber()
        : 0,
    ETH:
      ethPrice > 0
        ? decimalDiv(totalCurrent, new Decimal(ethPrice)).toNumber()
        : 0,
    BNB:
      bnbPrice > 0
        ? decimalDiv(totalCurrent, new Decimal(bnbPrice)).toNumber()
        : 0,
    USDT: decimalDiv(totalCurrent, new Decimal(usdtPrice)).toNumber(),
    SOL:
      solPrice > 0
        ? decimalDiv(totalCurrent, new Decimal(solPrice)).toNumber()
        : 0,
  };

  return {
    wallets: walletsWithChange,
    totalBalance,
    totalChange24h,
    totals,
    totalAssets: walletList.length,
    isLoading,
    error,
  };
};
