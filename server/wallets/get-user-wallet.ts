"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";

// Define type for nested wallet
interface WalletInfo {
  symbol: string;
  address: string;
}

// Define type for user_wallet row
export interface UserWalletRow {
  id: string;
  wallet_type: string;
  balance: number;
  wallets?: WalletInfo[];
}

const getUserWallet = async (
  userId: string,
  type: string = "USDT"
): Promise<UserWalletRow> => {
  const { data: userWallet, error: walletsError } = await supabaseAdmin
    .from("user_wallets")
    .select(
      `
      id,
      wallet_type,
      balance
    `
    )
    .eq("user_id", userId)
    .eq("wallet_type", type);

  if (walletsError) {
    console.error("Failed to fetch user wallets:", walletsError.message);
    throw new Error("Could not fetch wallets.");
  }

  if (!userWallet || userWallet.length === 0) {
    throw new Error("No wallets found for this user.");
  }

  return userWallet[0];
};

export default getUserWallet;
