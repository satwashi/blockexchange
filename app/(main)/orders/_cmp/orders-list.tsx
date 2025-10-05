"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { useEffect } from "react";
import useCountdown from "@/hooks/use-coutdown";
import { Order } from "@/types/order";
import useLossMyTrade from "@/queries/trade/use-loss-my-trade";

export type UIOrder = {
  symbol: string;
  side: "LONG" | "SHORT";
  amount: number;
  time: string;
  pnl: number | null;
  status: "OPEN" | "CLOSED";
  created_at?: string | null;
  on_market: boolean;
  code?: string; // invisible code if provided
};

const formatDateTime = (dateInput?: string | Date | null) => {
  if (!dateInput) {
    return { date: "--", time: "--", relative: "--" };
  }
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    relative: formatDistance(date, new Date(), { addSuffix: true }),
  };
};

const formatPnL = (pnl: number | null) => {
  if (pnl === null) return "-";
  const formatted = pnl.toFixed(2);
  return pnl >= 0 ? `+$${formatted}` : `-$${Math.abs(pnl).toFixed(2)}`;
};

const badgeToneClass = (isPositive: boolean) =>
  isPositive
    ? "bg-green-600/20 text-green-500 border-green-600/30"
    : "bg-red-700/15 text-red-600 border-red-700/25";

const statusBadgeClass = (isOpen: boolean) =>
  isOpen
    ? "bg-blue-600/20 text-blue-500 border-blue-600/30"
    : "bg-gray-600/15 text-gray-400 border-gray-600/25";

function parseDurationSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  return Number(parts[0] || 0);
}

function getExpiryDate(created_at: string, time: string) {
  if (!created_at || !time) return;

  // Parse duration from order.time ("mm:ss" or "hh:mm:ss")
  const parts = time.split(":").map(Number);
  let totalSeconds = 0;
  if (parts.length === 3) {
    const [h, m, s] = parts;
    totalSeconds = h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    totalSeconds = m * 60 + s;
  } else {
    totalSeconds = parts[0];
  }

  const createdAt = new Date(created_at);
  const expiry = new Date(createdAt.getTime() + totalSeconds * 1000);
  return expiry;
}
function OrderRow({ order }: { order: Order }) {
  const dateTime = formatDateTime(order.created_at);
  const isLong = order.side === "LONG";
  const expiry = getExpiryDate(order.created_at, order.time);
  const { lossMyTrade } = useLossMyTrade(order.id);

  // ✅ Toast when countdown reaches 0, status is OPEN, and on_market is false
  const { seconds } = useCountdown(expiry);

  useEffect(() => {
    if (seconds <= 0 && order.status === "OPEN" && !order.on_market) {
      lossMyTrade();
    }
  }, [seconds, order.status, order.on_market]);

  return (
    <Card className="border-border hover:border-accent transition-colors">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Symbol and Side */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-foreground">
                {order.symbol}
              </span>
              <Badge variant="secondary" className={badgeToneClass(isLong)}>
                {order.side}
              </Badge>
              <Badge
                className={`md:hidden ${statusBadgeClass(
                  order.status === "OPEN"
                )}`}
                variant="secondary"
              >
                {order.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Amount: <span className="font-mono">{order.amount}</span>
            </div>
          </div>

          {/* Time and Duration */}
          <div className="space-y-2">
            <div className="text-sm">
              <div className="text-muted-foreground">Duration</div>
              <div className="font-mono text-foreground">{order.time}</div>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Created</div>
              <div className="text-foreground">{dateTime.relative}</div>
            </div>
          </div>

          {/* P&L */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">P&L</div>
            <div
              className={`text-lg font-mono ${
                order.pnl === null
                  ? "text-muted-foreground"
                  : order.pnl >= 0
                  ? "text-green-500 font-semibold"
                  : "text-red-600 font-semibold"
              }`}
            >
              {formatPnL(order.pnl)}
            </div>
          </div>

          {/* Status and Date */}
          <div className="space-y-2">
            <div className="hidden md:flex items-center gap-2">
              <Badge
                className={statusBadgeClass(order.status === "OPEN")}
                variant="secondary"
              >
                {order.status}
              </Badge>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">{dateTime.date}</div>
              <div className="text-muted-foreground">{dateTime.time}</div>
            </div>
          </div>
        </div>
        {/* <> {seconds}</> */}
      </CardContent>
    </Card>
  );
}

const OrderList = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Badge variant="default">{orders.length} orders</Badge>
      </div>

      <div className="grid gap-4">
        {orders.map((order, index) => (
          <OrderRow key={index} order={order} />
        ))}
      </div>
    </div>
  );
};
export default OrderList;
