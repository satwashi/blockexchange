import CryptoChart from "@/components/crypto/crypto-chart";

import TradingForm from "./_cmp/trading-from";

// --- Main layout ---
export default function TradingControls({
  params,
}: {
  params: { crypto: string };
}) {
  const { crypto } = params;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 min-h-screen">
      <div className="w-full md:flex-[2] h-[60vh] md:h-[calc(100vh-2rem)]">
        <CryptoChart crypto={crypto} />
      </div>
      <TradingForm symbol={`${crypto.toUpperCase()}`} />
    </div>
  );
}
