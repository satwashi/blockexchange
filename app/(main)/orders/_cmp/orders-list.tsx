"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { useEffect } from "react";
import useCountdown from "@/hooks/use-coutdown";
import { Order } from "@/types/order";
import useLossMyTrade from "@/queries/trade/use-loss-my-trade";
import EmptyState from "@/components/shared/empty-state";
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
  const isPositive = pnl >= 0;
  return `${isPositive ? "+" : "-"}$${Math.abs(pnl).toFixed(2)}`;
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

  return null;
}

function OrderCard({ order }: { order: Order }) {
  const dateTime = formatDateTime(order.created_at);
  const isLong = order.side === "LONG";
  const expiry = getExpiryDate(order.created_at, order.time);
  const isOpen = order.status === "OPEN";
  const pnlFormatted = formatPnL(order.pnl);
  const isWin = order.pnl !== null && order.pnl >= 0;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Symbol & Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg text-foreground">
            {order.symbol}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              isLong
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {order.side}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs",
              isOpen
                ? "bg-blue-500/20 text-blue-400"
                : "bg-zinc-500/20 text-zinc-400"
            )}
          >
            {order.status}
          </span>
        </div>

        {/* Amount */}
        <div>
          <span className="text-sm text-muted-foreground">Amount: </span>
          <span className="text-foreground">
            {order.amount?.toLocaleString()}
          </span>
        </div>

        {/* Duration */}
        <div>
          <div className="text-sm text-muted-foreground">Duration</div>
          <div className="text-foreground font-mono">
            {order.time}
          </div>
        </div>

        {/* Created */}
        <div>
          <div className="text-sm text-muted-foreground">Created</div>
          <div className="text-foreground">
            {dateTime.relative}
          </div>
        </div>

        {/* P&L */}
        <div>
          <div className="text-sm text-muted-foreground">P&L</div>
          {pnlFormatted ? (
            <div
              className={cn(
                "text-xl",
                isWin ? "text-emerald-400" : "text-red-400"
              )}
            >
              {pnlFormatted}
            </div>
          ) : (
            <div className="text-muted-foreground">--</div>
          )}
        </div>

        {/* Date & Time */}
        <div className="pt-2 border-t border-border/30">
          <div className="text-sm text-muted-foreground">{dateTime.date}</div>
          <div className="text-sm text-muted-foreground">{dateTime.time}</div>
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
        <Badge variant="secondary" className="bg-yellow-500/15 text-yellow-500 border-yellow-500/30">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {orders.map((order, index) => (
          <OrderCard key={order.id || index} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
