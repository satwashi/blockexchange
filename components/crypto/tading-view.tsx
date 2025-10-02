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
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = "BITSTAMP:BTCUSD",
  theme = "dark",
  width = "100%",
  interval = "D",
  backgroundColor = "#0F0F0F",
  gridColor = "rgba(242, 242, 242, 0.06)",
  range = "YTD",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  useEffect(() => {
    const container = containerRef.current; // ✅ store ref in a variable
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: true,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      interval,
      autosize: true, // chart fills parent container
      locale: "en",
      save_image: true,
      style: "1",
      symbol,
      theme,
      timezone: "Etc/UTC",
      backgroundColor,
      gridColor,
      withdateranges: true,
      range,
      studies: [],
    });

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = ""; // ✅ safe cleanup
    };
  }, [symbol, theme, interval, backgroundColor, gridColor, range]);

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
