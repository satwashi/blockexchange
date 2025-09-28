import { Card } from "@/components/ui/card";

export default function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="text-center space-y-2">
        <div className="text-primary text-2xl font-bold">0.1%</div>
        <div className="text-sm text-muted-foreground">Trading Fee</div>
      </Card>
      <Card className="text-center space-y-2">
        <div className="text-primary text-2xl font-bold">600+</div>
        <div className="text-sm text-muted-foreground">Cryptocurrencies</div>
      </Card>

      <Card className="text-center space-y-2">
        <div className="text-primary text-2xl font-bold">200+</div>
        <div className="text-sm text-muted-foreground">Countries</div>
      </Card>

      <Card className="text-center space-y-2">
        <div className="text-primary text-2xl font-bold">$76B</div>
        <div className="text-sm text-muted-foreground">24h Volume</div>
      </Card>
    </div>
  );
}
