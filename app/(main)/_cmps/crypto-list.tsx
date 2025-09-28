import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CryptoItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const cryptoData: CryptoItem[] = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$110,195.46",
    change: "+0.75%",
    isPositive: true,
    icon: "₿",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: "$4,375.99",
    change: "-1.79%",
    isPositive: false,
    icon: "Ξ",
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    price: "$854.90",
    change: "-1.22%",
    isPositive: false,
    icon: "◆",
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    price: "$2.79",
    change: "+0.11%",
    isPositive: true,
    icon: "◇",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    price: "$202.02",
    change: "-0.28%",
    isPositive: false,
    icon: "◉",
  },
];

export function CryptoList() {
  return (
    <section className="bg-crypto-card border-t border-crypto-border">
      <div className="container mx-auto px-4 py-8">
        <CryptoListNav />

        <div className="space-y-3">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center justify-between p-4 bg-crypto-surface hover:bg-crypto-border rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500 text-crypto-dark flex items-center justify-center font-bold">
                  {crypto.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{crypto.symbol}</span>
                    <span className="text-muted-foreground">{crypto.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="font-semibold">{crypto.price}</div>
                </div>
                <div className="flex items-center space-x-1 min-w-[80px] justify-end">
                  {crypto.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                  <span
                    className={
                      crypto.isPositive ? "text-success" : "text-destructive"
                    }
                  >
                    {crypto.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CryptoListNav() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-6">
        <h2 className="text-xl font-semibold">Popular</h2>
        <Button variant="ghost" className="text-muted-foreground">
          New Listing
        </Button>
      </div>
      <Button variant="ghost" className="text-yellow-500">
        View All 350+ Coins →
      </Button>
    </div>
  );
}
