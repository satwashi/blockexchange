"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTradingView } from "@/hooks/use-traiding-view";
import { FullscreenToggle } from "./full-screen";
import { useTheme } from "next-themes";

export default function CryptoChart({ crypto }: { crypto: string }) {
  // const defaultSymbol = "BTCUSD";
  // // const [currentSymbol, setCurrentSymbol] = useState(
  // //   cryptoSymbol || defaultSymbol
  // );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();

  // useEffect(() => {
  //   if (cryptoSymbol) {
  //     setCurrentSymbol(cryptoSymbol.toUpperCase());
  //   }
  // }, [cryptoSymbol]);

  console.log(crypto);

  const chartContainerRef = useTradingView(crypto, theme as "light" | "dark");

  return (
    <Card
      className={
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "w-full h-full"
      }
    >
      {/* Reduced padding to make the header less tall */}
      <div className="flex flex-row items-center justify-between px-2 h-2">
        <span>{crypto.toUpperCase()}-USDT</span>

        <FullscreenToggle
          isFullscreen={isFullscreen}
          onToggle={() => setIsFullscreen(!isFullscreen)}
        />
      </div>
      <CardContent
        className={isFullscreen ? "h-[calc(100vh-140px)]" : "h-[500px] p-0"}
      >
        <div
          ref={chartContainerRef}
          id="tradingview-chart"
          className="w-full h-full bg-gray-500"
        />
      </CardContent>
    </Card>
  );
}
