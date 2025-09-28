"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";

export type WalletActionParams = {
  user_id: string;
  wallet_type: string;
  amount: number;
  type?: "deposit" | "withdraw";
};

export default async function withdrawCrypto({
  user_id,
  wallet_type,
  amount,
  type,
}: WalletActionParams) {
  // Ensure amount is negative for withdrawals
  const adjustedAmount = type === "withdraw" && amount > 0 ? -amount : amount;

  const { data, error } = await supabaseAdmin.rpc("decrement_wallet_balance", {
    p_user_id: user_id,
    p_wallet_type: wallet_type,
    p_amount: adjustedAmount,
  });

  if (error) {
    if (error.message.includes("INSUFFICIENT_BALANCE")) {
      throw new Error(`User does not have enough ${wallet_type} balance.`);
    }
    console.error(
      `Wallet action failed (${type} ${wallet_type}):`,
      error.message
    );
    throw new Error(`Could not ${type} ${wallet_type} from wallet.`);
  }

  return data;
}
