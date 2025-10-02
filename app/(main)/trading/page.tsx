"use client";
import { useTheme } from "next-themes";
import TradingForm from "../trade/[crypto]/_cmp/trading-from";
import TradingViewWidget from "@/components/crypto/tading-view";

export default function TradingControls() {
  const { theme } = useTheme();
  const tradingViewSymbol = `BINANCE:BTCUSDT`;
  return (
    <div className="flex flex-col gap-8 p-4 mx-auto">
      {/* --- Chart Section --- */}
      <div className="w-full h-[30vh] md:h-[30vh]">
        <TradingViewWidget
          symbol={tradingViewSymbol}
          // height={500}
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
