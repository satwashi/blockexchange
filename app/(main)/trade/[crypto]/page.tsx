"use client";
import { useTheme } from "next-themes";
import TradingForm from "./_cmp/trading-from";
import TradingViewWidget from "@/components/crypto/tading-view";

export default function TradingControls() {
  const { theme } = useTheme();
  const tradingViewSymbol = `BINANCE:BTCUSDT`;

  return (
    <div className="flex flex-col gap-8 p-4 min-h-screen max-w-6xl mx-auto">
      {/* --- Chart Section --- */}
      <div className="w-full h-[60vh] md:h-[70vh]">
        <TradingViewWidget
          symbol={tradingViewSymbol}
          height="100%" // Fill the parent div
          theme={theme === "dark" ? "dark" : "light"}
        />
      </div>

      {/* --- Trading Form Section --- */}
      <div className="w-full">
        <TradingForm symbol="BTC" />
      </div>
    </div>
  );
}
