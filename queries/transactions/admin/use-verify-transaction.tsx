"use client";

import { queryClient } from "@/providers/query-provider";
import { verifyTransaction } from "@/server/transactions/admin/verfiy-transactions";
import { Transaction } from "@/types/transactions";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useVerifyTransaction = () => {
  const mutation = useMutation<Transaction, Error, string>({
    // Accept transactionId as a string
    mutationFn: async (transactionId: string) => {
      return await verifyTransaction(transactionId);
    },
    onSuccess: (transaction) => {
      toast.success(
        `✅ Transaction ${transaction.transaction_type} verified successfully`
      );

      queryClient.invalidateQueries({
        queryKey: ["all-transactions"],
      });
    },
    onError: (error) => {
      toast.error(`❌ Transaction verification failed: ${error.message}`);
    },
  });

  return {
    verifyTransaction: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export default useVerifyTransaction;
