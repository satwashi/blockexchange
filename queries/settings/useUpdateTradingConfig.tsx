"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateTradingConfig from "@/server/settings/update-trading-config";
import { TradingConfig } from "@/types/settings";

export const useUpdateTradingConfig = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateConfig, isPending: isUpdatinng } = useMutation({
    mutationFn: (config: TradingConfig) => updateTradingConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading_config"] });
    },
  });

  return { updateConfig, isUpdatinng };
};
