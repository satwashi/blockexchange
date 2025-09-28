import toggleCloseMarket from "@/server/settings/toggle-close-market";
import { TradingConfig } from "@/types/settings";

import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useToggleCloseMarket = () => {
  const { mutate: toggleMarket, isPending: isToggling } = useMutation({
    mutationFn: ({ config }: { config: TradingConfig }) =>
      toggleCloseMarket(config),
  });

  return { toggleMarket, isToggling };
};
