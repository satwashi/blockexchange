"use client";

import { Search, DollarSign, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useCoins from "@/queries/coins/use-coins";
import { MarketHeaderSkeleton } from "./skeletons/market-header-skeleton";

const formatLargeNumber = (num: number) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toFixed(0)}`;
};

export default function MarketHeader() {
  const { searchTerm, setSearchTerm, marketStats, isLoading } = useCoins({ realtime: true }); // Enable WebSocket for market page

  if (isLoading) {
    return <MarketHeaderSkeleton />;
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-6">
        {/* Search input */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-card to-card/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="text-lg font-semibold text-foreground">
                    {marketStats
                      ? formatLargeNumber(marketStats.totalMarketCap)
                      : "..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-card to-card/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Activity className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-semibold text-foreground">
                    {marketStats
                      ? formatLargeNumber(marketStats.totalVolume)
                      : "..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-card to-card/80">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    marketStats && marketStats.avgChange >= 0
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <TrendingUp
                    className={`h-5 w-5 ${
                      marketStats && marketStats.avgChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Change</p>
                  <p
                    className={`text-lg font-semibold ${
                      marketStats && marketStats.avgChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {marketStats
                      ? (marketStats.avgChange >= 0 ? "+" : "") +
                        marketStats.avgChange.toFixed(2) +
                        "%"
                      : "..."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
