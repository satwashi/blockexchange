"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import TradingForm from "./_cmp/trading-from";
import TradingViewWidget from "@/components/crypto/tading-view";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function TradingControls() {
  const { crypto } = useParams<{ crypto: string }>();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const tradingViewSymbol = `BINANCE:${crypto}USDT`;

  // Wait for theme to be mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use theme after mounted to avoid hydration mismatch
  const chartTheme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 min-h-screen max-w-6xl mx-auto">
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
        <TradingForm symbol={crypto || "BTC"} />
      </div>
    </div>
  );
}
