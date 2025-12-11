import useCountdown from "@/hooks/use-coutdown";
import { OrderWithUser } from "@/types/order";
import { formatDate } from "@/utils/format";
import {
  Check,
  X,
  User,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fast O(1) lookup Map for crypto icons
const CRYPTO_ICON_MAP = new Map<string, string>([
  ["BTC", "/crypto-icons/bitcoin.svg"],
  ["BITCOIN", "/crypto-icons/bitcoin.svg"],
  ["ETH", "/crypto-icons/ethereum.svg"],
  ["ETHEREUM", "/crypto-icons/ethereum.svg"],
  ["BNB", "/crypto-icons/bnb.svg"],
  ["SOL", "/crypto-icons/solana.svg"],
  ["SOLANA", "/crypto-icons/solana.svg"],
  ["XRP", "/crypto-icons/xrp.svg"],
  ["RIPPLE", "/crypto-icons/xrp.svg"],
  ["ADA", "/crypto-icons/cardano.svg"],
  ["CARDANO", "/crypto-icons/cardano.svg"],
  ["DOGE", "/crypto-icons/dogecoin.svg"],
  ["DOGECOIN", "/crypto-icons/dogecoin.svg"],
  ["DOT", "/crypto-icons/polkadot.svg"],
  ["POLKADOT", "/crypto-icons/polkadot.svg"],
  ["LTC", "/crypto-icons/litecoin.svg"],
  ["LITECOIN", "/crypto-icons/litecoin.svg"],
  ["AVAX", "/crypto-icons/avalanche.svg"],
  ["AVALANCHE", "/crypto-icons/avalanche.svg"],
  ["TRX", "/crypto-icons/tron.svg"],
  ["TRON", "/crypto-icons/tron.svg"],
  ["USDT", "/crypto-icons/tether.svg"],
  ["TETHER", "/crypto-icons/tether.svg"],
  ["BCH", "/crypto-icons/bch.svg"],
  ["EOS", "/crypto-icons/eos.svg"],
  ["XLM", "/crypto-icons/stellar.svg"],
  ["STELLAR", "/crypto-icons/stellar.svg"],
  ["DASH", "/crypto-icons/dash.svg"],
  ["ZEC", "/crypto-icons/zcash.svg"],
  ["ZCASH", "/crypto-icons/zcash.svg"],
  ["NEO", "/crypto-icons/neo.svg"],
  ["IOTA", "/crypto-icons/iota.svg"],
  ["OMG", "/crypto-icons/omg.svg"],
  ["QTUM", "/crypto-icons/qtum.svg"],
]);

// Fast O(1) lookup Map for forex/stocks/commodities icons
const FOREX_ICON_MAP = new Map<string, string>([
  // Currencies
  ["USD", "/forex-icons/USD.png"],
  ["EUR", "/forex-icons/EUR.png"],
  ["GBP", "/forex-icons/GBP.png"],
  ["JPY", "/forex-icons/JPY.png"],
  ["AUD", "/forex-icons/AUD.png"],
  ["CAD", "/forex-icons/CAD.png"],
  ["CHF", "/forex-icons/CHF.png"],
  ["NZD", "/forex-icons/NZD.png"],
  ["HKD", "/forex-icons/HKD.png"],
  ["SGD", "/forex-icons/SGD.png"],
  ["SEK", "/forex-icons/SEK.png"],
  ["DKK", "/forex-icons/DKK.png"],
  ["NOK", "/forex-icons/NOK.png"],
  ["MXN", "/forex-icons/MXN.png"],
  ["PLN", "/forex-icons/PLN.png"],
  ["RUB", "/forex-icons/RUB.png"],
  ["ZAR", "/forex-icons/ZAR.png"],
  ["TRY", "/forex-icons/TRY.png"],
  ["HUF", "/forex-icons/HUF.png"],
  ["JMD", "/forex-icons/JMD.png"],
  // Stocks
  ["AAPL", "/forex-icons/APPL.png"],
  ["APPL", "/forex-icons/APPL.png"],
  ["APPLE", "/forex-icons/APPL.png"],
  ["AMZN", "/forex-icons/AMZN.png"],
  ["AMAZON", "/forex-icons/AMZN.png"],
  ["GOOGL", "/forex-icons/GOOGLE.png"],
  ["GOOGLE", "/forex-icons/GOOGLE.png"],
  ["GOOG", "/forex-icons/GOOGLE.png"],
  ["META", "/forex-icons/META.jpg"],
  ["FB", "/forex-icons/META.jpg"],
  ["MSFT", "/forex-icons/MSFT.png"],
  ["MICROSOFT", "/forex-icons/MSFT.png"],
  ["NVDA", "/forex-icons/nvda.png"],
  ["NVIDIA", "/forex-icons/nvda.png"],
  ["TSLA", "/forex-icons/TSL.png"],
  ["TSL", "/forex-icons/TSL.png"],
  ["TESLA", "/forex-icons/TSL.png"],
  ["JPM", "/forex-icons/JPM.png"],
  ["MCD", "/forex-icons/MCD.png"],
  ["PFE", "/forex-icons/PFE.png"],
  // Commodities
  ["XAU", "/forex-icons/XAU.png"],
  ["GOLD", "/forex-icons/XAU.png"],
  ["XAUUSD", "/forex-icons/XAU.png"],
  ["XAG", "/forex-icons/XAG.png"],
  ["SILVER", "/forex-icons/XAG.png"],
  ["XAGUSD", "/forex-icons/XAG.png"],
  ["USOIL", "/forex-icons/USOIL.svg"],
  ["WTI", "/forex-icons/USOIL.svg"],
  ["CRUDE", "/forex-icons/USOIL.svg"],
  ["UKOIL", "/forex-icons/UKOIL.svg"],
  ["BRENT", "/forex-icons/UKOIL.svg"],
  ["NATGAS", "/forex-icons/NATGAS.svg"],
  ["GAS", "/forex-icons/NATGAS.svg"],
  // Indices
  ["SPX500", "/forex-icons/SPX500.svg"],
  ["SPX", "/forex-icons/SPX500.svg"],
  ["SP500", "/forex-icons/SPX500.svg"],
  ["US500", "/forex-icons/SPX500.svg"],
  ["US30", "/forex-icons/US30.svg"],
  ["DOW", "/forex-icons/US30.svg"],
  ["DJIA", "/forex-icons/US30.svg"],
  ["NASDAQ", "/forex-icons/nasdaq100.svg"],
  ["NAS100", "/forex-icons/nasdaq100.svg"],
  ["NDX", "/forex-icons/nasdaq100.svg"],
  ["DAX", "/forex-icons/dax.svg"],
  ["GER40", "/forex-icons/dax.svg"],
  ["DE40", "/forex-icons/dax.svg"],
]);

// Extract base currency from symbol
const extractBaseCurrency = (symbol: string): string => {
  if (!symbol) return "";

  const cleaned = symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Check for known indices/commodities first (they might have numbers)
  const knownSymbols = [
    "SPX500", "US500", "SP500", "US30", "NAS100", "NASDAQ100",
    "XAUUSD", "XAGUSD", "USOIL", "UKOIL", "NATGAS"
  ];
  for (const known of knownSymbols) {
    if (cleaned.includes(known) || cleaned.startsWith(known.slice(0, 3))) {
      return known;
    }
  }

  // Common quote currencies to strip from end
  const quotes = ["USDT", "USD", "BUSD", "USDC", "EUR", "GBP", "JPY", "BTC", "ETH"];

  for (const quote of quotes) {
    if (cleaned.endsWith(quote) && cleaned.length > quote.length) {
      return cleaned.slice(0, -quote.length);
    }
  }

  // For forex pairs like EURUSD, take first 3 chars
  if (cleaned.length === 6) {
    return cleaned.slice(0, 3);
  }

  return cleaned.slice(0, Math.min(cleaned.length, 4));
};

// Fast icon lookup - checks both maps
const getSymbolIcon = (symbol: string): string | null => {
  if (!symbol) return null;

  const upper = symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // Try full symbol first
  if (CRYPTO_ICON_MAP.has(upper)) return CRYPTO_ICON_MAP.get(upper)!;
  if (FOREX_ICON_MAP.has(upper)) return FOREX_ICON_MAP.get(upper)!;

  // Try extracted base
  const base = extractBaseCurrency(symbol);
  if (CRYPTO_ICON_MAP.has(base)) return CRYPTO_ICON_MAP.get(base)!;
  if (FOREX_ICON_MAP.has(base)) return FOREX_ICON_MAP.get(base)!;

  // Try first 3-4 chars
  const short4 = upper.slice(0, 4);
  const short3 = upper.slice(0, 3);
  if (CRYPTO_ICON_MAP.has(short4)) return CRYPTO_ICON_MAP.get(short4)!;
  if (FOREX_ICON_MAP.has(short4)) return FOREX_ICON_MAP.get(short4)!;
  if (CRYPTO_ICON_MAP.has(short3)) return CRYPTO_ICON_MAP.get(short3)!;
  if (FOREX_ICON_MAP.has(short3)) return FOREX_ICON_MAP.get(short3)!;

  return null;
};

// Icon component for trading pair
const PairIcon = ({ symbol }: { symbol: string }) => {
  const iconPath = getSymbolIcon(symbol);
  const base = extractBaseCurrency(symbol);

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={base}
        className="w-7 h-7 rounded-full object-cover"
        loading="lazy"
      />
    );
  }

  // Fallback: show first 2 letters
  return (
    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
      {base.slice(0, 2)}
    </div>
  );
};

export const orderColumns = [
  {
    key: "user",
    label: "User",
    render: (order: OrderWithUser) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-sm text-foreground">
            {order.user?.name || "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {order.user_id?.slice(0, 8)}...
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "symbol",
    label: "Pair",
    render: (order: OrderWithUser) => (
      <div className="flex items-center gap-2.5">
        <PairIcon symbol={order.symbol || ""} />
        <span className="font-semibold text-foreground">{order.symbol}</span>
      </div>
    ),
  },
  {
    key: "side",
    label: "Side",
    render: (order: OrderWithUser) => (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
          order.side === "LONG"
            ? "bg-emerald-500/15 text-emerald-500"
            : "bg-red-500/15 text-red-500"
        )}
      >
        {order.side === "LONG" ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {order.side}
      </span>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (order: OrderWithUser) => (
      <div className="flex items-center gap-1.5">
        <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-medium">{order.amount?.toLocaleString()}</span>
      </div>
    ),
  },
  {
    key: "time",
    label: "Duration",
    render: (order: OrderWithUser) => {
      if (!order.time)
        return <span className="text-muted-foreground">--</span>;

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
        display += `${minutes}m`;
        if (seconds > 0) display += ` ${seconds}s`;
      } else {
        display = `${seconds}s`;
      }

      return (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{display}</span>
        </div>
      );
    },
  },
  {
    key: "pnl",
    label: "PnL",
    render: (order: OrderWithUser) => {
      if (order.pnl === null) {
        return <span className="text-muted-foreground">--</span>;
      }

      const isWin = order.pnl >= 0;
      return (
      <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold",
            isWin
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-red-500/15 text-red-500"
          )}
        >
          {isWin ? "WIN" : "LOSS"} ${Math.abs(order.pnl).toFixed(2)}
        </span>
      );
    },
  },
  {
    key: "profit_range",
    label: "Profit Range",
    render: (order: OrderWithUser) => (
      <span className="text-sm text-muted-foreground">
        {order.profit_range || "--"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (order: OrderWithUser) => (
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
            order.status === "OPEN" ? "bg-blue-500 animate-pulse" : "bg-zinc-400"
          )}
        />
        {order.status}
      </span>
    ),
  },
  {
    key: "remaining",
    label: "Remaining",
    render: (order: OrderWithUser) => {
      if (!order.created_at || !order.time) {
        return <span className="text-muted-foreground">--</span>;
      }

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
    key: "on_market",
    label: "On Market",
    render: (order: OrderWithUser) => (
      <span
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-lg",
          order.on_market
            ? "bg-emerald-500/15 text-emerald-500"
            : "bg-red-500/15 text-red-500"
        )}
      >
        {order.on_market ? (
          <Check className="w-4 h-4" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </span>
    ),
  },
  {
    key: "created_at",
    label: "Created",
    render: (order: OrderWithUser) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(order.created_at)}
      </span>
    ),
  },
];

function Remaining({ expiry }: { expiry: Date }) {
  const { formatted, isExpired } = useCountdown(expiry);

  return (
    <span
      className={cn(
        "font-mono text-sm",
        isExpired ? "text-muted-foreground" : "text-amber-500"
      )}
    >
      {formatted}
    </span>
  );
}
