import { TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

export default function ListOfTabs({ numFavs }: { numFavs: number }) {
  return (
    <TabsList
      className="
        w-full mb-6 bg-muted
        flex flex-wrap gap-2 p-2        /* ✅ mobile: wrap with spacing */
        md:grid md:grid-cols-4 md:gap-0 md:p-0  /* ✅ from md: 4-column */
        h-auto md:h-15
      "
    >
      <TabsTrigger
        value="all"
        className="flex-1 min-w-[45%] md:min-w-0 text-sm sm:text-base"
      >
        All Coins
      </TabsTrigger>

      <TabsTrigger
        value="favorites"
        className="flex-1 min-w-[45%] md:min-w-0 text-sm sm:text-base"
      >
        <Star className="h-4 w-4 mr-1 sm:mr-2 text-primary shrink-0" />
        Favorites ({numFavs})
      </TabsTrigger>

      <TabsTrigger
        value="gainers"
        className="flex-1 min-w-[45%] md:min-w-0 text-sm sm:text-base"
      >
        <TrendingUp className="h-4 w-4 mr-1 sm:mr-2 text-green-500 shrink-0" />
        Top Gainers
      </TabsTrigger>

      <TabsTrigger
        value="losers"
        className="flex-1 min-w-[45%] md:min-w-0 text-sm sm:text-base"
      >
        <TrendingDown className="h-4 w-4 mr-1 sm:mr-2 rotate-180 text-destructive shrink-0" />
        Top Losers
      </TabsTrigger>
    </TabsList>
  );
}
