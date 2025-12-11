"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { useEffect } from "react";
import useCountdown from "@/hooks/use-coutdown";
import { Order } from "@/types/order";
import useLossMyTrade from "@/queries/trade/use-loss-my-trade";
import PairIcon from "@/components/shared/pair-icon";
import EmptyState from "@/components/shared/empty-state";
import { TrendingUp, TrendingDown, Clock, DollarSign, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type UIOrder = {
  symbol: string;
  side: "LONG" | "SHORT";
  amount: number;
  time: string;
  pnl: number | null;
  status: "OPEN" | "CLOSED";
  created_at?: string | null;
  on_market: boolean;
  code?: string;
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
  if (pnl === null) return null;
  return Math.abs(pnl).toFixed(2);
};

function getExpiryDate(created_at: string, time: string) {
  if (!created_at || !time) return;

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

// Invisible countdown - just runs the logic without displaying
function InvisibleCountdown({ 
  expiry, 
  orderId, 
  status, 
  onMarket 
}: { 
  expiry: Date; 
  orderId: string;
  status: string;
  onMarket: boolean;
}) {
  const { lossMyTrade } = useLossMyTrade(orderId);
  const { seconds } = useCountdown(expiry);

  useEffect(() => {
    if (seconds <= 0 && status === "OPEN" && !onMarket) {
      lossMyTrade();
    }
  }, [seconds, status, onMarket, lossMyTrade]);

  return null; // Renders nothing
}

function OrderRow({ order }: { order: Order }) {
  const dateTime = formatDateTime(order.created_at);
  const isLong = order.side === "LONG";
  const expiry = getExpiryDate(order.created_at, order.time);
  const isOpen = order.status === "OPEN";

  const pnlValue = formatPnL(order.pnl);
  const isWin = order.pnl !== null && order.pnl >= 0;

  return (
    <Card className="border-border/50 hover:border-border transition-all duration-200 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Main Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Symbol with overlapping icons */}
            <div className="flex items-center gap-3">
              <PairIcon symbol={order.symbol} size="lg" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-bold text-foreground">
                    {order.symbol}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold",
                      isLong
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-red-500/15 text-red-500"
                    )}
                  >
                    {isLong ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {order.side}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="font-medium">{order.amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Right: Status */}
            <div className="text-right">
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                  order.status === "OPEN"
                    ? "bg-blue-500/15 text-blue-500"
                    : "bg-zinc-500/15 text-zinc-400"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mr-1.5",
                    order.status === "OPEN"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-zinc-400"
                  )}
                />
                {order.status}
              </span>
              <div className="text-xs text-muted-foreground mt-1.5">
                {dateTime.relative}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="px-4 sm:px-5 py-3 border-t border-border/50 bg-muted/20 flex items-center justify-between gap-4 flex-wrap">
          {/* Duration & Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{order.time}</span>
            </div>
            {isOpen && (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs font-medium">Running on chain</span>
              </div>
            )}
          </div>

          {/* PnL */}
          <div>
            {order.pnl !== null ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold",
                  isWin
                    ? "bg-emerald-500/15 text-emerald-500"
                    : "bg-red-500/15 text-red-500"
                )}
              >
                {isWin ? "WIN" : "LOSS"} ${pnlValue}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">--</span>
            )}
          </div>
        </div>

        {/* Invisible countdown for triggering loss */}
        {isOpen && expiry && (
          <InvisibleCountdown
            expiry={expiry}
            orderId={order.id}
            status={order.status}
            onMarket={order.on_market}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface OrderListProps {
  orders: Order[];
  filter?: "all" | "open" | "closed";
}

const OrderList = ({ orders, filter = "all" }: OrderListProps) => {
  if (!orders || orders.length === 0) {
    const variant = filter === "open" 
      ? "orders-open" 
      : filter === "closed" 
        ? "orders-closed" 
        : "orders-all";
    
    return <EmptyState variant={variant} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Badge variant="secondary" className="bg-muted/50">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Badge>
      </div>

      <div className="grid gap-3">
        {orders.map((order, index) => (
          <OrderRow key={order.id || index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
