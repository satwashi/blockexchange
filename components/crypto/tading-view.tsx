"use client";
import React, { useEffect, useRef, memo, useId } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  width?: string | number;
  height?: string | number;
  interval?: string;
  backgroundColor?: string;
  gridColor?: string;
  range?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = "BITSTAMP:BTCUSD",
  theme = "dark",
  width = "100%",
  height = 610,
  interval = "D",
  backgroundColor = "#0F0F0F",
  gridColor = "rgba(242, 242, 242, 0.06)",
  range = "YTD",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous script/widget
    containerRef.current.innerHTML = "";

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
      hotlist: true,
      interval,
      autosize: true,
      locale: "en",
      save_image: true,
      style: "1",
      symbol,
      theme,
      timezone: "Etc/UTC",
      backgroundColor,
      gridColor,
      watchlist: [],
      withdateranges: true,
      range,
      compareSymbols: [],
      studies: [],
      width,
      height,
    });

    containerRef.current.appendChild(script);

    return () => {
      containerRef.current!.innerHTML = "";
    };
  }, [
    symbol,
    theme,
    width,
    height,
    interval,
    backgroundColor,
    gridColor,
    range,
  ]);

  return (
    <div
      className="tradingview-widget-container"
      id={`tradingview-${uniqueId}`}
    >
      <div
        className="tradingview-widget-container__widget"
        ref={containerRef}
      />
      {/* <div className="tradingview-widget-copyright">
        <a
          href={`https://www.tradingview.com/symbols/${symbol.split(":")[1]}/`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">{symbol} Chart</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div> */}
    </div>
  );
};

export default memo(TradingViewWidget);
