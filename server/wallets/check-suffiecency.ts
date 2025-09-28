import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function checkSufficiency({
  user_id,
  wallet_type,
  amount,
}: {
  user_id: string;
  wallet_type: string;
  amount: number;
}): Promise<boolean> {
  const { data: wallet, error: walletError } = await supabaseAdmin
    .from("user_wallets")
    .select("balance")
    .eq("user_id", user_id)
    .eq("wallet_type", wallet_type)
    .single();

  if (walletError) {
    console.error("Wallet lookup failed:", walletError.message);
    throw new Error("Wallet not found for user");
  }

  if (!wallet || wallet.balance < amount) {
    return false; // insufficient
  }

  return true; // sufficient
}
