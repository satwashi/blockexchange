import CryptoChart from "@/components/crypto/crypto-chart";
import TradingForm from "../trade/[crypto]/_cmp/trading-from";

export default function TradingControls() {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 min-h-screen">
      <div className="w-full md:flex-[2] h-[60vh] md:h-[calc(100vh-2rem)]">
        <CryptoChart crypto={"BTC"} />
      </div>
      <TradingForm symbol="BTC" />
    </div>
  );
}
