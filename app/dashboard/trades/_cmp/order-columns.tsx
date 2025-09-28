import useCountdown from "@/hooks/use-coutdown";
import { Order } from "@/types/order";
import { formatDate } from "@/utils/format";
import { Check, X } from "lucide-react";

export const orderColumns = [
  {
    key: "symbol",
    label: "Pair",
    render: (order: Order) => (
      <span className="font-medium">{order.symbol}</span>
    ),
  },
  {
    key: "side",
    label: "Side",
    render: (order: Order) => (
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
    render: (order: Order) => {
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
    render: (order: Order) => (
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
    render: (order: Order) => <span>{order.profit_range}</span>,
  },
  ,
  {
    key: "status",
    label: "Status",
    render: (order: Order) => (
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
    render: (order: Order) => {
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
    render: (order: Order) => (
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
    render: (order: Order) => <span>{formatDate(order.created_at)}</span>,
  },
];

function Remaining({ expiry }: { expiry: Date }) {
  const { formatted } = useCountdown(expiry);

  return <span>{formatted}</span>;
}
