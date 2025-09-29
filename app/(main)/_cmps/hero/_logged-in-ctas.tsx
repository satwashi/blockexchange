"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, Wallet2 } from "lucide-react";
import { useCreateUserWalllets } from "@/queries/wallets/use-create-user-wallets";
import { useState } from "react";
import { toast } from "sonner";

export default function LoggedInCtas({
  userVerified,
}: {
  userVerified: boolean;
}) {
  const { createWallets, isCreating } = useCreateUserWalllets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateWallet = () => {
    setIsSubmitting(true);
    try {
      createWallets();
      toast.success("Wallet creation started");
    } catch (e) {
      toast.error("Failed to start wallet creation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!userVerified && (
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Complete your account</AlertTitle>
          <AlertDescription>
            1) Log in ✓ 2) KYC verification required — please verify to unlock
            deposits, trading, and withdrawals.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href="/market">Start trading</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/wallet/deposit">Deposit funds</a>
        </Button>
        <Button
          variant="secondary"
          onClick={handleCreateWallet}
          disabled={isCreating || isSubmitting}
        >
          <Wallet2 className="mr-2 h-4 w-4" /> Create wallet
        </Button>
      </div>
    </div>
  );
}
