"use client";

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

// Get icon path for a symbol
export const getIconPath = (symbol: string): string | null => {
  if (!symbol) return null;
  const upper = symbol.toUpperCase();
  return CRYPTO_ICON_MAP.get(upper) || FOREX_ICON_MAP.get(upper) || null;
};

// Parse symbol into base and quote (e.g., "EURJPY" -> { base: "EUR", quote: "JPY" })
export const parseSymbol = (symbol: string): { base: string; quote: string | null } => {
  if (!symbol) return { base: "", quote: null };

  // Remove separators like - or /
  const cleaned = symbol.toUpperCase().replace(/[-\/]/g, "");

  // Check for forex pairs (6 chars like EURUSD, EURJPY)
  if (cleaned.length === 6) {
    return {
      base: cleaned.slice(0, 3),
      quote: cleaned.slice(3),
    };
  }

  // Check for crypto pairs ending with common quotes
  const quotes = ["USDT", "USD", "BUSD", "USDC", "EUR", "GBP", "BTC", "ETH"];
  for (const quote of quotes) {
    if (cleaned.endsWith(quote) && cleaned.length > quote.length) {
      return {
        base: cleaned.slice(0, -quote.length),
        quote: quote,
      };
    }
  }

  // Single asset or unknown format
  return { base: cleaned.slice(0, 3), quote: null };
};

interface PairIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: { container: "w-8 h-5", base: "w-5 h-5", quote: "w-4 h-4", offset: "-ml-2" },
  md: { container: "w-10 h-7", base: "w-7 h-7", quote: "w-5 h-5", offset: "-ml-2.5" },
  lg: { container: "w-14 h-9", base: "w-9 h-9", quote: "w-7 h-7", offset: "-ml-3" },
};

// Single icon bubble
const IconBubble = ({
  symbol,
  sizeClass,
  className,
}: {
  symbol: string;
  sizeClass: string;
  className?: string;
}) => {
  const iconPath = getIconPath(symbol);

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={symbol}
        className={cn(
          sizeClass,
          "rounded-full object-cover ring-2 ring-background",
          className
        )}
        loading="lazy"
      />
    );
  }

  // Fallback
  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground ring-2 ring-background",
        className
      )}
    >
      {symbol.slice(0, 2)}
    </div>
  );
};

export default function PairIcon({
  symbol,
  size = "md",
  className,
}: PairIconProps) {
  const { base, quote } = parseSymbol(symbol);
  const sizes = sizeClasses[size];

  return (
    <div className={cn("flex items-center", sizes.container, className)}>
      <IconBubble symbol={base} sizeClass={sizes.base} />
      {quote && (
        <IconBubble
          symbol={quote}
          sizeClass={cn(sizes.quote, sizes.offset)}
        />
      )}
    </div>
  );
}

// Wallet icon for transactions (single icon)
export function WalletIcon({
  walletType,
  size = "md",
  className,
}: {
  walletType: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }[size];

  const iconPath = getIconPath(walletType);

  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={walletType}
        className={cn(sizeClass, "rounded-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground",
        className
      )}
    >
      {walletType.slice(0, 2)}
    </div>
  );
}
