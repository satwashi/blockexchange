import { useState } from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import MiniChart from "./mini-chart";
import { CryptoIcon } from "./crypto-icon";

export interface CryptoData {
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  marketCap: number;
  priceHistory: number[];
}

interface CryptoTableProps {
  data: CryptoData[];
  onFavorite?: (symbol: string) => void;
  favorites?: Set<string>;
}

export default function CryptoTable({
  data,
  onFavorite,
  favorites = new Set(),
}: CryptoTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CryptoData;
    direction: "asc" | "desc";
  } | null>(null);

  const router = useRouter();
  const handleRowClick = (symbol: string) => {
    // Remove 'USDT' from the end of the symbol if it exists
    const cleanedSymbol = symbol.toUpperCase().endsWith("USDT")
      ? symbol.slice(0, -4)
      : symbol;

    console.log(cleanedSymbol);
    router.push(`/trade/${cleanedSymbol.toLowerCase()}`);
  };

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPercentage = (num: number) => {
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof CryptoData) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {/* Desktop Table Header */}
      <div className="bg-table-header hidden md:block">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 flex items-center justify-center">#</div>
          <div className="col-span-2">Coin</div>
          <div
            className="col-span-1 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("price")}
          >
            Price
          </div>
          <div
            className="col-span-1 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("change1h")}
          >
            1h
          </div>
          <div
            className="col-span-1 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("change24h")}
          >
            24h
          </div>
          <div
            className="col-span-1 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("change7d")}
          >
            7d
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("volume24h")}
          >
            24h Volume
          </div>
          <div
            className="col-span-2 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => handleSort("marketCap")}
          >
            Market Cap
          </div>
          <div className="col-span-1">Last 7 Days</div>
        </div>
      </div>

      <div className="bg-card">
        {sortedData.map((crypto, index) => (
          <div key={crypto.symbol}>
            {/* 🖥️ Desktop Row */}
            <div
              className="hidden md:grid grid-cols-12 gap-4 px-4 py-4 border-b border-border/50 cursor-pointer hover:bg-muted/10 transition-colors group"
              onClick={() => handleRowClick(crypto.symbol)}
            >
              <div className="col-span-1 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFavorite?.(crypto.symbol);
                  }}
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      favorites.has(crypto.symbol) &&
                        "fill-orange-500 text-orange-500"
                    )}
                  />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  {index + 1}
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-3">
                <CryptoIcon symbol={crypto.symbol} />
                <div>
                  <div className="font-medium text-foreground">
                    {crypto.symbol.replace("USDT", "")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {crypto.symbol}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-500/80 text-black font-medium px-3 py-1 h-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  Buy
                </Button>
              </div>

              <div className="col-span-1 flex items-center">
                <span className="font-medium text-foreground">
                  {formatNumber(crypto.price)}
                </span>
              </div>

              <div className="col-span-1 flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    crypto.change1h >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {crypto.change1h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(crypto.change1h)}
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {crypto.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(crypto.change24h)}
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    crypto.change7d >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {crypto.change7d >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(crypto.change7d)}
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground">
                  {formatNumber(crypto.volume24h)}
                </span>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm text-foreground">
                  {formatNumber(crypto.marketCap)}
                </span>
              </div>

              <div className="col-span-1 flex items-center">
                <MiniChart
                  data={crypto.priceHistory}
                  isPositive={crypto.change7d >= 0}
                />
              </div>
            </div>

            {/* 📱 Mobile Card */}
            <div
              className="md:hidden p-4 border-b border-border/50 cursor-pointer hover:bg-muted/10 transition-colors"
              onClick={() => handleRowClick(crypto.symbol)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite?.(crypto.symbol);
                    }}
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        favorites.has(crypto.symbol) &&
                          "fill-orange-500 text-orange-500"
                      )}
                    />
                  </Button>
                  <CryptoIcon symbol={crypto.symbol} />
                  <div>
                    <div className="font-medium text-foreground">
                      {crypto.symbol.replace("USDT", "")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      #{index + 1} • {formatNumber(crypto.marketCap)} cap
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-foreground text-lg">
                    {formatNumber(crypto.price)}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium justify-end",
                      crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatPercentage(crypto.change24h)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">1h</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        crypto.change1h >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {formatPercentage(crypto.change1h)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">7d</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        crypto.change7d >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {formatPercentage(crypto.change7d)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Volume
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {formatNumber(crypto.volume24h)}
                    </div>
                  </div>
                </div>
                <div className="w-32 h-16">
                  <MiniChart
                    data={crypto.priceHistory}
                    isPositive={crypto.change7d >= 0}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
