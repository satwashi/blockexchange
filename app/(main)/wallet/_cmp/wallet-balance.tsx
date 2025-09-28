import { Card, CardContent } from "@/components/ui/card";
import { useUserWallets } from "@/queries/wallets/use-user-wallets";
import { TrendingUp, Wallet } from "lucide-react";

interface WalletBalanceProps {
  userId: string;
}

export const WalletBalance = ({ userId }: WalletBalanceProps) => {
  const { totalBalance, totalAssets, totalChange24h, isLoading, error } =
    useUserWallets(userId);

  if (isLoading) return <>Loading</>;
  if (error) return <>Error</>;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (totalAssets === 0) return;

  return (
    <Card className="bg-secondary border-0  mb-8">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full  flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-medium opacity-90">Your Total Asset</h2>
            <p className="text-sm opacity-75">{totalAssets} Assets</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-4xl md:text-5xl font-bold">
              {formatCurrency(totalBalance!)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                totalChange24h >= 0
                  ? "bg-success/20 text-success-foreground"
                  : "bg-destructive/20 text-destructive-foreground"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {totalChange24h >= 0 ? "+" : ""}
              {totalChange24h.toFixed(2)}%
            </div>
            <span className="text-sm opacity-75">Last 24 hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
