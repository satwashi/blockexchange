"use client";
import CryptoMarket from "./_cmps/crypto-market";
import MarketHeader from "./_cmps/market-header";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <MarketHeader />
      <CryptoMarket />
    </div>
  );
}
