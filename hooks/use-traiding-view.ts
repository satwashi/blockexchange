"use client";
import { useEffect, useRef } from "react";

// Hook for managing TradingView widget
export const useTradingView = (
  symbol: string,
  theme: "light" | "dark" = "light"
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (containerRef.current) {
          widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol,
            container_id: containerRef.current.id,
            interval: "1D",
            timezone: "Etc/UTC",
            theme,
            style: "1",
            locale: "en",
            toolbar_bg: theme === "light" ? "#f1f3f6" : "#141414",
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
          });
        }
      };
      document.head.appendChild(script);
      return () => script.parentNode?.removeChild(script);
    }

    if (containerRef.current) {
      widgetRef.current?.remove();
      containerRef.current.innerHTML = "";
      widgetRef.current = new window.TradingView.widget({
        autosize: true,
        symbol,
        container_id: containerRef.current.id,
        interval: "1D",
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "en",
        toolbar_bg: theme === "light" ? "#f1f3f6" : "#141414",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
      });
    }

    return () => {
      widgetRef.current?.remove();
      widgetRef.current = null;
    };
  }, [symbol, theme]);

  return containerRef;
};
