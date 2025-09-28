import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import useVerifyTransaction from "@/queries/transactions/admin/use-verify-transaction";

export default function VerifyTransaction({
  transaction_id,
}: {
  transaction_id: string;
}) {
  const { verifyTransaction, isPending } = useVerifyTransaction();

  function onMarkWin() {
    verifyTransaction(transaction_id);
  }

  return (
    <Button
      variant="ghost"
      className="w-full flex"
      disabled={isPending}
      onClick={onMarkWin}
    >
      <Check className="mr-2 h-4 w-4 text-green-600" />
      Verify Transaction
    </Button>
  );
}
