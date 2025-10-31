"use client";
import CryptoMarket from "./_cmps/crypto-market";
import MarketHeader from "./_cmps/market-header";
import MarketOverview from "./_cmps/market-overview";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* <MarketHeader />
      <CryptoMarket /> */}
      <MarketOverview />
    </div>
  );
}
