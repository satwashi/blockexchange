"use client";

import { useUserWallets } from "@/queries/wallets/use-user-wallets";

export function WalletBalancesList({ userId }: { userId: string }) {
  const { wallets, isLoading, error } = useUserWallets(userId);

  if (!userId) return null;
  if (isLoading)
    return <div className="text-sm opacity-70">Loading wallets…</div>;
  if (error)
    return (
      <div className="text-sm text-destructive">Failed to load wallets</div>
    );
  if (!wallets || wallets.length === 0) return null;

  const formatBalance = (val: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(val);

  return (
    <ul className="space-y-2">
      {wallets.map((w) => (
        <li key={w.id} className="flex items-center justify-between text-sm">
          <span className="font-medium">{w.wallet_type}</span>
          <span className="tabular-nums">{formatBalance(w.balance)}</span>
        </li>
      ))}
    </ul>
  );
}

export default WalletBalancesList;
