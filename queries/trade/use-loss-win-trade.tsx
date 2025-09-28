"use client";

import { queryClient } from "@/providers/query-provider";
import changeOrderStatus from "@/server/orders/admin/change-order-status";
import depositCrypto from "@/server/wallets/deposit-crypto";
import withdrawCrypto, {
  WalletActionParams,
} from "@/server/wallets/withdraw-crypto";
import { Order } from "@/types/order";
import { safeAddCrypto } from "@/utils/crypto/arthimetic";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export type WinLose = Order & {
  walletType?: string;
  type: "deposit" | "withdraw";
};

const useLossWinTrade = () => {
  const { mutateAsync: lossOrWinTrade, isPending } = useMutation({
    mutationFn: async (order: WinLose) => {
      const { user_id, id, pnl, status, walletType, type, amount } = order;

      const newAmount = safeAddCrypto(amount, pnl);
      toast.success(newAmount);
      const data: WalletActionParams = {
        user_id,
        amount: Number(newAmount),
        wallet_type: walletType || "USDT",
        type,
      };

      // if (order.type === "withdraw") {
      //   await withdrawCrypto(data);
      // } else {
      await depositCrypto(data);
      // }

      return await changeOrderStatus(
        {
          status,
          pnl: order.pnl!,
        },
        user_id,
        id
      );
    },
    onSuccess: (data, variables) => {
      // Show success toast
      toast.success(
        `Trade marked as ${variables.status} with PNL: ${variables.pnl}`
      );

      // ✅ Invalidate all_orders query to refetch updated orders
      queryClient.invalidateQueries({ queryKey: ["all_orders"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(`Trade failed: ${error.message}`);
      } else {
        toast.error("Trade failed: Unknown error");
      }
    },
  });

  return { lossOrWinTrade, isPending };
};

export default useLossWinTrade;
