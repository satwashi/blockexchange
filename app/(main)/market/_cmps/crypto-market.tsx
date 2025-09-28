import { Tabs, TabsContent } from "@/components/ui/tabs";
import CryptoTable from "./crypto-table";
import ListOfTabs from "./tabs-list";

import useCoins from "@/queries/coins/use-coins";
import { CryptoMarketSkeleton } from "./skeletons/crypto-market-skeleton";
import { ListOfTabsSkeleton } from "./skeletons/tab-list-skeleton";

export default function CryptoMarket() {
  const {
    filteredCoins,
    favoriteCoins,
    favorites,
    topGainers,
    topLosers,
    handleFavorite,
    isLoading,
  } = useCoins();

  if (isLoading)
    return (
      <>
        <ListOfTabsSkeleton />
        <CryptoMarketSkeleton />;
      </>
    );

  return (
    <div>
      <Tabs defaultValue="all">
        <ListOfTabs numFavs={favorites.size} />
        <TabsContent value="all">
          <CryptoTable
            data={filteredCoins || []}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        </TabsContent>
        <TabsContent value="favorites">
          <CryptoTable
            data={favoriteCoins}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        </TabsContent>
        <TabsContent value="gainers">
          <CryptoTable
            data={topGainers}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        </TabsContent>
        <TabsContent value="losers">
          <CryptoTable
            data={topLosers}
            favorites={favorites}
            onFavorite={handleFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
