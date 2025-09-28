import { TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

export default function ListOfTabs({ numFavs }: { numFavs: number }) {
  return (
    <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted py-2 h-15">
      <TabsTrigger value="all">All Coins</TabsTrigger>

      <TabsTrigger value="favorites">
        <Star className="h-4 w-4 mr-2 text-primary" />
        Favorites ({numFavs})
      </TabsTrigger>

      <TabsTrigger value="gainers">
        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
        Top Gainers
      </TabsTrigger>

      <TabsTrigger value="losers">
        <TrendingDown className="h-4 w-4 mr-2 rotate-180 text-destructive" />
        Top Losers
      </TabsTrigger>
    </TabsList>
  );
}
