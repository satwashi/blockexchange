"use client";

import { queryClient } from "@/providers/query-provider";
import initTransaction from "@/server/transactions/init-transaction";
import { uploadDepositPhoto } from "@/server/transactions/upload-deposite-photos";
import {
  InitTransactionParams,
  Transaction,
  TransactionType,
} from "@/types/transactions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface InitTransactionParamsLocal {
  wallet_type: string;
  amount: number;
  transaction_type: TransactionType;
  address?: string;
  image?: File;
}

const useInitTransaction = () => {
  const { mutateAsync, isPending } = useMutation<
    Transaction,
    unknown,
    InitTransactionParamsLocal
  >({
    mutationFn: async (data: InitTransactionParamsLocal) => {
      // Await the server action

      const { image, wallet_type, amount, transaction_type, address } = data;
      const data_: InitTransactionParams = {
        wallet_type,
        amount,
        transaction_type,
        address,
      };
      if (image) {
        const { publicUrl } = await uploadDepositPhoto(image);
        data_.image = publicUrl;
      }

      const transaction = await initTransaction(data_);

      if (!transaction) {
        throw new Error("Failed to initiate transaction");
      }

      return transaction;
    },
    onSuccess: (data) => {
      toast.success(
        `Transaction ${data.transaction_type} started successfully!`
      );

      // Refetch updated transactions
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(`Trade failed: ${error.message}`);
      } else {
        toast.error("Trade failed: Unknown error");
      }
    },
  });

  return { initTransaction: mutateAsync, isPending };
};

export default useInitTransaction;
