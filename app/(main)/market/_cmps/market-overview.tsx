"use client";
// TradingViewWidget.tsx
import React, { useEffect, useRef, useState, memo } from "react";
import { useTheme } from "next-themes";

const MarketOverview: React.FC<{ locale?: string; className?: string }> = ({
  locale = "en",
  className,
}) => {
  const container = useRef<HTMLDivElement | null>(null);
  const { theme, systemTheme } = useTheme();
  const resolvedTheme = (theme === "system" ? systemTheme : theme) || "dark";
  const colorTheme = resolvedTheme === "dark" ? "dark" : "light";

  const [height, setHeight] = useState<number>(550);

  useEffect(() => {
    if (!container.current) return;

    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width || 400;
      if (width < 360) setHeight(420);
      else if (width < 640) setHeight(480);
      else if (width < 1024) setHeight(520);
      else setHeight(550);
    });
    ro.observe(container.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    el.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = `
      {
        "colorTheme": "${colorTheme}",
        "dateRange": "12M",
        "locale": "${locale}",
        "largeChartUrl": "",
        "isTransparent": false,
        "showFloatingTooltip": false,
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(41, 98, 255, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "scaleFontColor": "#DBDBDB",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              { "s": "FOREXCOM:SPXUSD", "d": "S&P 500 Index" },
              { "s": "FOREXCOM:NSXUSD", "d": "US 100 Cash CFD" },
              { "s": "FOREXCOM:DJI", "d": "Dow Jones Industrial Average Index" },
              { "s": "INDEX:NKY", "d": "Japan 225" },
              { "s": "INDEX:DEU40", "d": "DAX Index" },
              { "s": "FOREXCOM:UKXGBP", "d": "FTSE 100 Index" }
            ],
            "originalTitle": "Indices"
          },
          {
            "title": "Futures",
            "symbols": [
              { "s": "BMFBOVESPA:ISP1!", "d": "S&P 500" },
              { "s": "BMFBOVESPA:EUR1!", "d": "Euro" },
              { "s": "CMCMARKETS:GOLD", "d": "Gold" },
              { "s": "PYTH:WTI3!", "d": "WTI Crude Oil" },
              { "s": "BMFBOVESPA:CCM1!", "d": "Corn" }
            ],
            "originalTitle": "Futures"
          },
          {
            "title": "Bonds",
            "symbols": [
              { "s": "EUREX:FGBL1!", "d": "Euro Bund" },
              { "s": "EUREX:FBTP1!", "d": "Euro BTP" },
              { "s": "EUREX:FGBM1!", "d": "Euro BOBL" }
            ],
            "originalTitle": "Bonds"
          },
          {
            "title": "Forex",
            "symbols": [
              { "s": "FX:EURUSD", "d": "EUR to USD" },
              { "s": "FX:GBPUSD", "d": "GBP to USD" },
              { "s": "FX:USDJPY", "d": "USD to JPY" },
              { "s": "FX:USDCHF", "d": "USD to CHF" },
              { "s": "FX:AUDUSD", "d": "AUD to USD" },
              { "s": "FX:USDCAD", "d": "USD to CAD" }
            ],
            "originalTitle": "Forex"
          },
          {
            "title": "Crypto",
            "symbols": [
              {
                "s": "BINANCE:BTCUSDT",
                "d": "BTC-USDT",
                "base-currency-logoid": "crypto/XTVCBTC",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "BINANCE:ETHUSD",
                "d": "Smart contracts & DeFi foundation.",
                "base-currency-logoid": "crypto/XTVCETH",
                "currency-logoid": "country/US"
              },
              {
                "s": "BINANCE:BNBUSDT",
                "d": "Binance ecosystem token.",
                "base-currency-logoid": "crypto/XTVCBNB",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "OKX:SOLUSDT",
                "d": "Fast, popular for dApps and DeFi.",
                "base-currency-logoid": "crypto/XTVCSOL",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "BINANCE:XRPUSDT",
                "d": "Banking and cross-border payments.",
                "base-currency-logoid": "crypto/XTVCXRP",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "BINANCE:ADAUSDT",
                "d": "Research-driven blockchain.",
                "base-currency-logoid": "crypto/XTVCADA",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "BINANCE:DOGEUSDT",
                "d": "Meme coin with massive popularity.",
                "base-currency-logoid": "crypto/XTVCDOGE",
                "currency-logoid": "crypto/XTVCUSDT"
              },
              {
                "s": "BINANCE:AVAXUSDT",
                "d": "High-speed DeFi platform.",
                "base-currency-logoid": "crypto/XTVCAVAX",
                "currency-logoid": "crypto/XTVCUSDT"
              }
            ]
          }
        ],
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "#0f0f0f",
        "width": "100%",
        "height": "${height}",
        "showSymbolLogo": true,
        "showChart": true
      }`;

    el.appendChild(script);

    return () => {
      el.innerHTML = "";
    };
  }, [colorTheme, height, locale]);

  return (
    <div
      className={`tradingview-widget-container w-full min-w-0 ${className ?? ""}`}
      ref={container}
    >
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
};

export default memo(MarketOverview);
