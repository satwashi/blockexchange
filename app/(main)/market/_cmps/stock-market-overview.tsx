import React, { useEffect, useRef, memo } from "react";

type StockMarketOverviewProps = {
  locale?: string; // Default: "en"
  theme?: "light" | "dark"; // Default: "dark"
};

const StockMarketOverview: React.FC<StockMarketOverviewProps> = ({
  locale = "en",
  theme = "dark", 
}) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear any previously injected scripts to prevent duplication
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "exchange": "US",
        "colorTheme": "${theme}",
        "dateRange": "12M",
        "showChart": true,
        "locale": "${locale}",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": false,
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
        "width": "100%",
        "height": "100%"
      }`;

    container.current.appendChild(script);
  }, [locale, theme]); // Re-run when locale or theme changes

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/markets/stocks-usa/"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <span className="blue-text">Stocks today</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
};

export default memo(StockMarketOverview);
