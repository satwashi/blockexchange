"use client";
import goLongOrShort from "@/server/trade/go-long-or-short";
import { NewOrder } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTrade = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: trade, isPending: isTrading } = useMutation({
    mutationFn: (order: NewOrder) => goLongOrShort(order),

    onSuccess: (data) => {
      if ((data as any)?.requiresKyc) {
        window.location.href = "/kyc"; // client-side redirect
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["my_orders"] });
      toast.success("✅ Trade started!");
    },

    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      toast.error(message);
    },
  });

  return { trade, isTrading };
};
