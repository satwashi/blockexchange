import { TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Star, TrendingUp } from "lucide-react";

export default function ListOfTabs({ numFavs }: { numFavs: number }) {
  return (
    <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted py-2 h-15">
      <TabsTrigger value="all">Open</TabsTrigger>

      <TabsTrigger value="favorites">
        <Star className="h-4 w-4 mr-2 text-primary" />
        Closed
      </TabsTrigger>

      <TabsTrigger value="gainers">
        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
        ALl
      </TabsTrigger>
    </TabsList>
  );
}
