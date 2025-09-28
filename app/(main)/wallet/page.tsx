"use client";

import { useSession } from "@/queries/useSession";
import RealtimeWallets from "./_cmp/realtime-wallets";
import { WalletBalance } from "./_cmp/wallet-balance";

const Index = () => {
  const { id, isLoading, error } = useSession();

  if (isLoading) return <>Loading</>;
  if (error) return <>Error</>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <WalletBalance userId={id!} />
        <RealtimeWallets userId={id!} />
      </div>
    </div>
  );
};

export default Index;
