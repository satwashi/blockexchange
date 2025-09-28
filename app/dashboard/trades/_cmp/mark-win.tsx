import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { Check } from "lucide-react";
import useLossWinTrade from "@/queries/trade/use-loss-win-trade";
import prepareProfitData from "@/utils/trade/prepare-profit-data";

export default function MarkWin({ order }: { order: Order }) {
  const { lossOrWinTrade, isPending } = useLossWinTrade();

  function onMarkWin() {
    const updated_order = prepareProfitData(order);

    lossOrWinTrade({
      ...updated_order,
      type: "deposit",
    });
  }

  return (
    <Button
      variant="ghost"
      className="w-full flex"
      disabled={isPending}
      onClick={onMarkWin}
    >
      <Check className="mr-2 h-4 w-4 text-green-600" />
      Mark As Win
    </Button>
  );
}
