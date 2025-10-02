"use client";

import { useSession } from "@/queries/useSession";
import RealtimeWallets from "./_cmp/realtime-wallets";
import { WalletBalance } from "./_cmp/wallet-balance";
import { WalletBalanceSkeleton } from "./_cmp/skeletons/wallet-balance";
import { WalletCardSkeleton } from "./_cmp/skeletons/wallets-card-skeleton";
import PortfolioSummary from "./_cmp/portfolio-summary";

export default function WalletPage() {
  const { id, isLoading, error } = useSession();

  if (isLoading)
    return (
      <>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <WalletBalanceSkeleton />
            <WalletCardSkeleton />
          </div>
        </div>
      </>
    );
  if (error) return <>Error</>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* <PortfolioSummary /> */}
        <WalletBalance userId={id!} />
        <RealtimeWallets userId={id!} />
      </div>
    </div>
  );
}
