import { useUserWallets } from "@/queries/wallets/use-user-wallets";
import { WalletCard } from "./wallet-card";
import { WalletCardSkeleton } from "./skeletons/wallets-card-skeleton";
import WalletCardWithProgress from "./wallet-creation/wallet-card-with-progress";

export default function RealtimeWallets({ userId }: { userId: string }) {
  const { wallets, isLoading, error } = useUserWallets(userId);

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <WalletCardSkeleton key={i} />
        ))}
      </div>
    );

  if (error) return <>Error</>;
  if (!wallets || wallets.length === 0) {
    return (
      <div className="min-h-[60vh] md:min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <WalletCardWithProgress>
            <div className="mb-6 p-4 rounded-xl ">
              <h4 className=" font-semibold mb-2">Trading Wallet</h4>
              <p className="text-sm">Enhanced features with exchange support</p>
            </div>
          </WalletCardWithProgress>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
