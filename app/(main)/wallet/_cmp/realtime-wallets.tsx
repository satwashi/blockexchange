import { useUserWallets } from "@/queries/wallets/use-user-wallets";
import { WalletCard } from "./wallet-card";
import { WalletCardSkeleton } from "./skeletons/wallets-card-skeleton";

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
    /* ... your empty state ... */
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
