"use client";

import { cn } from "@/lib/utils";
import { CryptoData } from "@/queries/coins/use-coins";
import { CryptoIcon } from "../../market/_cmps/crypto-icon";

interface CoinListProps {
  coins: CryptoData[];
}

export default function CoinList({ coins }: CoinListProps) {
  return (
    <div className="space-y-2">
      {coins.map((coin) => (
        <div
          key={coin.symbol}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition"
        >
          {/* Left: Icon + Symbol + Name */}
          <div className="flex items-center gap-3">
            <CryptoIcon symbol={coin.symbol} />
            <div className="flex flex-col">
              <span className="font-semibold text-base">{coin.symbol}</span>
              <span className="text-sm text-muted-foreground">
                {getFullName(coin.symbol)}
              </span>
            </div>
          </div>

          {/* Middle: Price */}
          <div className="text-right">
            <span className="text-lg font-semibold">
              ${coin.price.toLocaleString()}
            </span>
          </div>

          {/* Right: 24h Change */}
          <div
            className={cn(
              "text-sm font-medium",
              coin.change24h >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {coin.change24h >= 0 ? "+" : ""}
            {coin.change24h.toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}

// Optional helper to show full names
function getFullName(symbol: string) {
  const names: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "BNB",
    XRP: "XRP",
    SOL: "Solana",
  };
  return names[symbol] || symbol;
}
