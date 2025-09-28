"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/client";
import fetchTradingConfig from "@/server/settings/fetch-trade-config";

export const useSetting = () => {
  const queryClient = useQueryClient();

  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trading_config"],
    queryFn: fetchTradingConfig,
  });

  useEffect(() => {
    const channel = supabase
      .channel("trading-config-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["trading_config"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const timeSeconds = config?.profit_ranges.map((r) => r.time_seconds) || [];

  const profit_ranges = config?.profit_ranges;
  const close_market = config?.close_market;

  return {
    close_market,
    timeSeconds,
    profit_ranges,
    config,
    isLoading,
    error,
  };
};
