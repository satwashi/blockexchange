"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CoinList from "./coin-list";
import useCoins from "@/queries/coins/use-coins";
import Link from "next/link";
import CoinListSkeleton from "../skeletons/coin-list";

export default function CoinShowCase() {
  const [mounted, setMounted] = useState(false);
  const { popular5, newListings5, isLoading, top5Gainers } = useCoins();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) return <CoinListSkeleton />;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="popular" className="w-full">
        {/* Header with tabs and view all link */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <TabsList className="flex gap-8 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="popular"
              className="relative pb-2 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-0 after:bg-yellow-500 data-[state=active]:after:w-full after:transition-all"
            >
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="relative pb-2 text-base font-medium text-muted-foreground data-[state=active]:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-0 after:bg-yellow-500 data-[state=active]:after:w-full after:transition-all"
            >
              Top Gainers
            </TabsTrigger>
          </TabsList>

          <Link
            href="/market"
            className="text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors whitespace-nowrap"
          >
            View All 350+ Coins →
          </Link>
        </div>

        {/* Content */}
        <TabsContent value="popular" className="mt-0">
          <CoinList coins={popular5} />
        </TabsContent>

        <TabsContent value="new" className="mt-0">
          <CoinList coins={top5Gainers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
