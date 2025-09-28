import { getRandomProfit } from "@/app/dashboard/trades/_cmp/order-actions";
import { WinLose } from "@/queries/trade/use-loss-win-trade";
import { Order } from "@/types/order";

export default function prepareProfitData(
  order: Order,
  type: string = "deposite"
) {
  const [min_profit, max_profit] = order.profit_range.split("-").map(Number);
  const profit = getRandomProfit(min_profit, max_profit);
  const amountInCents = Math.round(order.amount * 100);
  const pnl = Math.round(amountInCents * profit) / 100;
  order.pnl = type === "deposite" ? pnl : -pnl;
  order.win_status = type === "deposite" ? "WIN" : "LOSS";
  order.status = "CLOSED";
  return order;
}
