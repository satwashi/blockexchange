"use client";

import { cn } from "@/lib/utils";
import { CryptoData } from "@/queries/coins/use-coins";
import { CryptoIcon } from "../../market/_cmps/crypto-icon";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CoinListProps {
  coins: CryptoData[];
}

export default function CoinList({ coins }: CoinListProps) {
  return (
    <div className="space-y-2">
      {coins.map((coin) => {
        const isUp = coin.change24h >= 0;
        return (
          <Button
            variant="ghost"
            key={coin.symbol}
            className={cn(
              "group relative w-full flex items-center justify-between rounded-xl p-2",
              "px-3 py-2 transition-transform duration-200"
            )}
          >
            {/* Left: Icon + Symbol + Name */}
            <div className="flex items-center gap-3">
              <CryptoIcon symbol={coin.symbol} />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-base leading-tight">
                  {coin.symbol}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getFullName(coin.symbol)}
                </span>
              </div>
            </div>

            {/* Middle: Price */}
            <div className="text-right">
              <span className="text-lg font-semibold tabular-nums font-mono">
                ${coin.price.toLocaleString()}
              </span>
            </div>

            {/* Right: 24h Change */}
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                isUp
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
              )}
            >
              {isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              <span className="tabular-nums">
                {isUp ? "+" : ""}
                {coin.change24h.toFixed(2)}%
              </span>
            </div>
          </Button>
        );
      })}
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
