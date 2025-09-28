"use client";

import { queryClient } from "@/providers/query-provider";

import lossMyTrade from "@/server/orders/users/loss-my-trade";

import { useMutation } from "@tanstack/react-query";

const useLossMyTrade = (order_id: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      lossMyTrade(order_id);
    },
    onSuccess: () => {
      // ✅ Invalidate all_orders query to refetch updated orders
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
  });

  return { lossMyTrade: mutateAsync, isPending };
};

export default useLossMyTrade;
