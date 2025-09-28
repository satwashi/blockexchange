"use client";

import { Button } from "@/components/ui/button";
import { Kyc, KycStatus } from "@/types/kyc/kyc";
import { Check, X } from "lucide-react";
import useVerifyKyc from "@/queries/kyc/use-verify-kyc";
import { toast } from "sonner";
import { queryClient } from "@/providers/query-provider";

export default function ChangeKycStatus({
  kyc,
  kyc_status,
}: {
  kyc: Kyc;
  kyc_status: KycStatus;
}) {
  const { verifyKyc, isPending } = useVerifyKyc();

  async function onChangeStatus() {
    const updatedKyc = {
      ...kyc,
      kyc_status,
    };

    verifyKyc(updatedKyc);
  }

  const isVerify = kyc_status === "verified";

  return (
    <Button
      variant="ghost"
      className="w-full flex"
      disabled={isPending}
      onClick={onChangeStatus}
    >
      {isVerify ? (
        <>
          <Check className="mr-2 h-4 w-4 text-green-600" />
          Verify KYC
        </>
      ) : (
        <>
          <X className="mr-2 h-4 w-4 text-red-600" />
          Reject KYC
        </>
      )}
    </Button>
  );
}
