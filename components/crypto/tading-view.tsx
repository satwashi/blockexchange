"use client";
import React, { useEffect, useRef, memo, useId } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  width?: string | number;
  interval?: string;
  backgroundColor?: string;
  gridColor?: string;
  range?: string;
  onSymbolChange?: (symbol: string) => void; // <-- new
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = "BITSTAMP:BTCUSD",
  theme,
  width = "100%",
  interval = "D",
  backgroundColor = "#0F0F0F",
  gridColor = "rgba(242, 242, 242, 0.06)",
  range = "YTD",
  onSymbolChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      theme,
      style: "1",
      timezone: "Etc/UTC",
      locale: "en",
      // allow_symbol_change: true,
      allow_symbol_change: false,
      hide_side_toolbar: false, // ✅ show drawing tools
      hide_top_toolbar: false, // ✅ show top toolbar (timeframes, settings, etc.)
      details: true,
      calendar: true,
      studies: [],
      backgroundColor,
      gridColor,
      withdateranges: true,
      range,
    });

    container.appendChild(script);

    // ✅ Listen for symbol changes via postMessage
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.name === "widget_symbol" && parsed?.symbol) {
          onSymbolChange?.(parsed.symbol);
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      container.innerHTML = "";
    };
  }, [
    symbol,
    theme,
    interval,
    backgroundColor,
    gridColor,
    range,
    onSymbolChange,
  ]);

  return (
    <div
      className="tradingview-widget-container w-full h-full"
      id={`tradingview-${uniqueId}`}
    >
      <div
        className="tradingview-widget-container__widget w-full h-full"
        ref={containerRef}
      />
    </div>
  );
};

export default memo(TradingViewWidget);
