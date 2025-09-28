"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // ✅ import router
import { submitKYC, SubmitKYCParams } from "@/server/kyc/submmit-kyc";

export default function useSubmitKyc() {
  const router = useRouter(); // ✅ init router

  const { mutateAsync, isPending } = useMutation<
    { success: boolean; kyc?: any; error?: string }, // return type from server action
    unknown,
    SubmitKYCParams
  >({
    mutationFn: async (data: SubmitKYCParams) => submitKYC(data),

    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          "KYC submitted successfully! Verification might take 24-48h."
        );
        router.back(); // ✅ go back to previous page
      } else {
        toast.error(`KYC submission failed: ${data.error}`);
      }
    },

    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(`KYC submission failed: ${error.message}`);
      } else {
        toast.error("KYC submission failed: Unknown error");
      }
    },
  });

  return { submitKYC: mutateAsync, isPending };
}
