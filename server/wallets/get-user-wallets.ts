"use server";

import { WalletData } from "@/app/(main)/wallet/_cmp/wallet-card";
import supabaseAdmin from "@/lib/supabaseAdmin";

const getUserWallets = async (userId: string): Promise<WalletData[]> => {
  const { data, error } = await supabaseAdmin
    .from("user_wallets")
    .select(
      `
    *,
    wallets (
      address,
      addresses
    )
  `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  console.log(data);

  // Map DB rows into WalletData
  return (data as any)
    .filter((row: any) => row.wallets !== null) // skip rows without wallets
    .map((row: any) => {
      const { wallet_type, balance, id, wallets } = row;
      const { address, addresses } = wallets;

      console.log(wallets, row);

      const icon = `/crypto/${wallet_type}.png`;
      return {
        id,
        wallet_type,
        name: row.wallets!.symbol, // optional: map to friendly names
        balance,
        address,
        addresses, // new: { "ERC20": "0x...", "TRC20": "T..." }
        change24h: 0,
        icon,
      } as WalletData;
    });
};

export default getUserWallets;
