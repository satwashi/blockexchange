"use client";

import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TradingViewWidget from "@/components/crypto/tading-view";
import TradingForm from "../../trade/[crypto]/_cmp/trading-from";
import { SymbolSelector } from "@/components/trading/symbol-selector";
import { symbolPairs } from "@/constants/symbol-pair";
import { Skeleton } from "@/components/ui/skeleton";

// Map our symbol format to TradingView format
const getTradingViewSymbol = (symbol: string): string => {
  // Find the pair to determine type
  const pair = symbolPairs.find((p) => p.symbol === symbol);
  
  if (!pair) return `BINANCE:BTCUSDT`;
  
  switch (pair.type) {
    case "Crypto":
      // Convert BTCUSD -> BINANCE:BTCUSDT
      const base = symbol.replace(/USD$/, "");
      return `BINANCE:${base}USDT`;
    case "Forex":
      return `FX:${symbol}`;
    case "Metal":
      return `OANDA:${symbol}`;
    case "Index/CFD":
      return `FOREXCOM:${symbol}`;
    case "Oil":
      return `TVC:${symbol}`;
    default:
      return `BINANCE:${symbol}`;
  }
};

// Get clean symbol for the form (e.g., "BTCUSD" -> "BTC")
const getFormSymbol = (symbol: string): string => {
  return symbol.replace(/USD$/, "");
};

export default function TradingPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Wait for theme to be mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentSymbol = symbol || "BTCUSD";
  const tradingViewSymbol = getTradingViewSymbol(currentSymbol);
  const formSymbol = getFormSymbol(currentSymbol);
  
  // Only use theme after mounted to avoid hydration mismatch
  const chartTheme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen max-w-6xl mx-auto">
      {/* Symbol Selector */}
      <div className="w-full md:w-64">
        <SymbolSelector value={currentSymbol} />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* --- Chart Section --- */}
        <div
          className="
            w-full md:w-2/3 
            h-[47vh] sm:h-[50vh] md:h-[70vh] 
            overflow-hidden rounded-lg border border-border/50
          "
        >
          {mounted ? (
            <TradingViewWidget 
              key={`${tradingViewSymbol}-${chartTheme}`} // Force remount on theme/symbol change
              symbol={tradingViewSymbol} 
              theme={chartTheme} 
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>

        {/* --- Trading Form Section --- */}
        <div className="w-full md:w-1/3">
          <TradingForm symbol={formSymbol} />
        </div>
      </div>
    </div>
  );
}

