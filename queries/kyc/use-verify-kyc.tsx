"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Kyc } from "@/types/kyc/kyc";
import { changeKycStatus } from "@/server/kyc/admin/change-kyc-status";
import { toast } from "sonner";
import { deleteSupabaseFile } from "@/server/kyc/admin/delete-supabase-file";
const useVerifyKyc = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (kyc: Kyc) => {
      return await changeKycStatus(kyc);
    },
    onSuccess: (data, variables) => {
      toast.success(`KYC marked as ${variables.kyc_status.toUpperCase()}`);

      // Show cleaning toast
      const cleaningToastId = toast.loading("Cleaning files...");

      (async () => {
        try {
          await deleteSupabaseFile(variables.id_file_url);
          await deleteSupabaseFile(variables.selfie_url);

          toast.success("Files cleaned successfully ✅", {
            id: cleaningToastId,
          });
        } catch (err) {
          console.error("Failed to delete Supabase files:", err);
          toast.error("Failed to clean files ❌", {
            id: cleaningToastId,
          });
        } finally {
          queryClient.invalidateQueries({ queryKey: ["all-kycs"] });
        }
      })();
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error
          ? `Failed to update KYC: ${error.message}`
          : "Failed to update KYC: Unknown error"
      );
    },
  });

  return { verifyKyc: mutateAsync, isPending };
};

export default useVerifyKyc;
