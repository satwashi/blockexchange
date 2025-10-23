import { MessageCircle } from "lucide-react";

// import { useLossWInTrade } from "@/queries/trade/use-loss-win-trade";
import { Order } from "@/types/order";
import { ActionItem } from "../../_cmp/Generic-table";
import Markloss from "./mark-loss";
import MarkWin from "./mark-win";
import ChatUser from "./chat-user";

export function getRandomProfit(
  min_profit: number,
  max_profit: number
): number {
  return (
    Math.random() * (max_profit - min_profit + Number.EPSILON) + min_profit
  );
}

// function update

export default function getOrderActions(order: Order): ActionItem<Order>[] {
  return [
    {
      label: "Mark as loss!",
      render: (order: Order) => {
        return <Markloss order={order} />;
      },
    },
    {
      label: "Mark as Win!",
      render: (order: Order) => {
        return <MarkWin order={order} />;
      },
    },
    {
      label: "Message user",
      render: (order: Order) => {
        return <ChatUser userId={order.user_id} />;
      },
    },
  ];
}
