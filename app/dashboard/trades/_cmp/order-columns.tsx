import useCountdown from "@/hooks/use-coutdown";
import { OrderWithUser } from "@/types/order";
import { formatDate } from "@/utils/format";
import { Check, X, User } from "lucide-react";

export const orderColumns = [
  {
    key: "user",
    label: "User",
    render: (order: OrderWithUser) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{order.user?.name || "Unknown"}</span>
          <span className="text-xs text-muted-foreground font-mono">{order.user_id?.slice(0, 8)}...</span>
        </div>
      </div>
    ),
  },
  {
    key: "symbol",
    label: "Pair",
    render: (order: OrderWithUser) => (
      <span className="font-medium">{order.symbol}</span>
    ),
  },
  {
    key: "side",
    label: "Side",
    render: (order: OrderWithUser) => (
      <span
        className={`font-bold ${
          order.side === "LONG" ? "text-green-600" : "text-red-600"
        }`}
      >
        {order.side}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "time",
    label: "Time",
    render: (order: OrderWithUser) => {
      if (!order.time) return "--";

      const parts = order.time.split(":").map(Number);
      let totalSeconds = 0;

      if (parts.length === 3) {
        const [h, m, s] = parts;
        totalSeconds = h * 3600 + m * 60 + s;
      } else if (parts.length === 2) {
        const [m, s] = parts;
        totalSeconds = m * 60 + s;
      } else if (parts.length === 1) {
        totalSeconds = parts[0];
      }

      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      let display = "";
      if (minutes > 0) {
        display += `${minutes} min`;
        if (seconds > 0) display += ` ${seconds} sec`;
      } else {
        display = `${seconds} sec`;
      }

      return <span>{display}</span>;
    },
  },
  {
    key: "pnl",
    label: "PnL",
    render: (order: OrderWithUser) => (
      <span
        className={`font-medium ${
          order.pnl !== null
            ? order.pnl >= 0
              ? "text-green-600"
              : "text-red-600"
            : "text-gray-400"
        }`}
      >
        {order.pnl !== null
          ? order.pnl >= 0
            ? `WIN ≈ ${order.pnl}`
            : `LOSS ≈ ${order.pnl}`
          : "--"}
      </span>
    ),
  },
  {
    key: "Profit-Range",
    label: "profit-range",
    render: (order: OrderWithUser) => <span>{order.profit_range}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (order: OrderWithUser) => (
      <span
        className={`capitalize font-medium ${
          order.status === "OPEN" ? "text-blue-600" : "text-gray-500"
        }`}
      >
        {order.status}
      </span>
    ),
  },
  {
    key: "remaining",
    label: "Remaining Time",
    render: (order: OrderWithUser) => {
      if (!order.created_at || !order.time) return "--";

      // Parse duration from order.time ("mm:ss" or "hh:mm:ss")
      const parts = order.time.split(":").map(Number);
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

      const createdAt = new Date(order.created_at);
      const expiry = new Date(createdAt.getTime() + totalSeconds * 1000);

      return <Remaining expiry={expiry} />;
    },
  },
  {
    key: "On Market",
    label: "On Market",
    render: (order: OrderWithUser) => (
      <span>
        {order.on_market ? (
          <Check color="green" size={16} />
        ) : (
          <X color="red" size={16} />
        )}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "Created At",
    render: (order: OrderWithUser) => <span>{formatDate(order.created_at)}</span>,
  },
];

function Remaining({ expiry }: { expiry: Date }) {
  const { formatted } = useCountdown(expiry);

  return <span>{formatted}</span>;
}
