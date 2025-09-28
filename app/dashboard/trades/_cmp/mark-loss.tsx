import { Button } from "@/components/ui/button";
import useLossWinTrade from "@/queries/trade/use-loss-win-trade";
import { Order } from "@/types/order";
import prepareProfitData from "@/utils/trade/prepare-profit-data";
import { X } from "lucide-react";

export default function Markloss({ order }: { order: Order }) {
  const { lossOrWinTrade, isPending } = useLossWinTrade();

  function onMarkloss() {
    const updated_order = prepareProfitData(order, "withdraw");

    lossOrWinTrade({
      ...updated_order,
      type: "withdraw",
    });
  }

  return (
    <Button
      variant="ghost"
      className="w-full flex"
      disabled={isPending}
      onClick={onMarkloss}
    >
      <X className="mr-2 h-4 w-4 text-red-600" />
      Mark As Looss
    </Button>
  );
}
