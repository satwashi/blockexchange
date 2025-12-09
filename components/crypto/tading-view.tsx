"use client";
import React, { useEffect, useRef, memo, useId } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  width?: string | number;
  interval?: string;
  range?: string;
  onSymbolChange?: (symbol: string) => void;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = "BITSTAMP:BTCUSD",
  theme = "dark",
  width = "100%",
  interval = "D",
  range = "YTD",
  onSymbolChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  // Dynamic colors based on theme
  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#0a0a0a" : "#ffffff";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";

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
      theme, // TradingView's built-in theme (light/dark)
      style: "1",
      timezone: "Etc/UTC",
      locale: "en",
      allow_symbol_change: false,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      details: true,
      calendar: true,
      studies: [],
      backgroundColor,
      gridColor,
      withdateranges: true,
      range,
    });

    container.appendChild(script);

    // Listen for symbol changes via postMessage
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
  }, [symbol, theme, interval, backgroundColor, gridColor, range, onSymbolChange]);

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
