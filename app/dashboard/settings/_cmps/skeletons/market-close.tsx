import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToggleCloseMarket } from "@/queries/settings/use-toggle-close-market.tsx";
import { TradingConfig } from "@/types/settings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// type MarketCloseProps = {
//   close_market: boolean;
// };

export default function MarketClose({ config }: { config: TradingConfig }) {
  const { toggleMarket, isToggling } = useToggleCloseMarket();
  const { close_market } = config;

  const updatedConfig = { ...config, close_market: !config.close_market };
  const queryClient = useQueryClient();
  const handleToggle = () => {
    toggleMarket(
      { config: updatedConfig },
      {
        onSuccess: () => {
          toast.success(
            close_market
              ? "Market reopened successfully"
              : "Market closed successfully"
          );
          queryClient.invalidateQueries({ queryKey: ["trading_config"] });
        },
        onError: () => toast.error("Failed to update market status"),
      }
    );
  };

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-trading">
          Market Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="close-market" className="text-base font-medium">
              Close Market
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically close positions at market close
            </p>
          </div>
          <Switch
            id="close-market"
            disabled={isToggling}
            checked={config.close_market}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
            aria-busy={isToggling}
          />
        </div>
      </CardContent>
    </Card>
  );
}
