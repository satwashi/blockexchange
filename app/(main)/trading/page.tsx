"use client";
import { useTheme } from "next-themes";

import TradingViewWidget from "@/components/crypto/tading-view";
import TradingForm from "../trade/[crypto]/_cmp/trading-from";

export default function TradingControls() {
  const { theme } = useTheme();
  const tradingViewSymbol = `BINANCE:BTCUSDT`;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 min-h-screen max-w-6xl mx-auto">
      {/* --- Chart Section --- */}
      <div
        className="
          w-full md:w-2/3 
          h-[47vh] sm:h-[50vh] md:h-[70vh] 
            overflow-hidden
        "
      >
        <TradingViewWidget
          symbol={tradingViewSymbol}
          theme={theme === "dark" ? "dark" : "light"}
        />
      </div>

      {/* --- Trading Form Section --- */}
      <div className="w-full md:w-1/3">
        <TradingForm symbol="BTC" />
      </div>
    </div>
  );
}
