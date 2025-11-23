import React, { useEffect, useRef, memo } from "react";

type MarketOverviewProps = {
  locale?: string; // Default: "en"
  theme?: "light" | "dark"; // Default: "dark"
};

const MarketOverview: React.FC<MarketOverviewProps> = ({
  locale = "en",
  theme = "dark",
}) => {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!container.current) return;

    // Clear previous scripts
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "${theme}",
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
              { "s": "BINANCE:BTCUSDT", "d": "BTC-USDT", "base-currency-logoid": "crypto/XTVCBTC", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "BINANCE:ETHUSD", "d": "Smart contracts & DeFi foundation.", "base-currency-logoid": "crypto/XTVCETH", "currency-logoid": "country/US" },
              { "s": "BINANCE:BNBUSDT", "d": "Binance ecosystem token.", "base-currency-logoid": "crypto/XTVCBNB", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "OKX:SOLUSDT", "d": "Fast, popular for dApps and DeFi.", "base-currency-logoid": "crypto/XTVCSOL", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "BINANCE:XRPUSDT", "d": "Banking and cross-border payments.", "base-currency-logoid": "crypto/XTVCXRP", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "BINANCE:ADAUSDT", "d": "Research-driven blockchain.", "base-currency-logoid": "crypto/XTVCADA", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "BINANCE:DOGEUSDT", "d": "Meme coin with massive popularity.", "base-currency-logoid": "crypto/XTVCDOGE", "currency-logoid": "crypto/XTVCUSDT" },
              { "s": "BINANCE:AVAXUSDT", "d": "High-speed DeFi platform.", "base-currency-logoid": "crypto/XTVCAVAX", "currency-logoid": "crypto/XTVCUSDT" }
            ]
          }
,
           {
            "title": "Metals",
            "symbols": [
              { "s": "CAPITALCOM:GOLD", "d": "Gold", "logoid": "metal/gold", "currency-logoid": "country/US" },
              { "s": "CAPITALCOM:SILVER", "d": "silver", "logoid": "metal/silver", "currency-logoid": "country/US" }
            ]
          }
        ],
        "support_host": "https://www.tradingview.com",
        "backgroundColor": "#0f0f0f",
        "width": "100%",
        "height": "100%",
        "showSymbolLogo": true,
        "showChart": true
      }`;

    container.current.appendChild(script);
  }, [locale, theme]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        {/* <a
          href="https://www.tradingview.com/markets/"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <span className="blue-text">Market summary</span>
        </a>
        <span className="trademark"> by TradingView</span> */}
      </div>
    </div>
  );
};

export default memo(MarketOverview);
