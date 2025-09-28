import supabaseAdmin from "@/lib/supabaseAdmin";

export default async function deductUSDT(
  userId: string,
  balance: number,
  amount: number
) {
  const value = balance - amount;
  const { data, error } = await supabaseAdmin

    .from("user_wallets")
    .update({ balance: value })
    .eq("user_id", userId)
    .eq("wallet_type", "USDT")
    .select();

  if (error) {
    console.error("Failed to deduct USDT:", error.message);
    throw new Error("Could not deduct USDT from wallet.");
  }

  return data;
}
