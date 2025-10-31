"use client";
import CryptoMarket from "./_cmps/crypto-market";
import MarketHeader from "./_cmps/market-header";
import MarketOverview from "./_cmps/market-overview";
import StockMarketOverview from "./_cmps/stock-market-overview";
import { useTheme } from "next-themes";
export default function Page() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* <MarketHeader />
      <CryptoMarket /> */}
      {/* <div className="h-[85vh] md:h-[75vh] lg:h-[70vh]">
        <StockMarketOverview locale="en" theme={theme as "light" | "dark"} />
      </div> */}
      <div className="w-full h-[calc(100dvh-64px-58px)] md:h-[calc(100dvh-64px)]">
        {/* <StockMarketOverview locale="en" theme={theme as "light" | "dark"} /> */}
        <MarketOverview />
      </div>

      {/* <MarketOverview /> */}
    </div>
  );
}
