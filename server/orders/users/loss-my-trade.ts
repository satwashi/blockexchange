"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import depositCrypto from "@/server/wallets/deposit-crypto";
import { WalletActionParams } from "@/server/wallets/withdraw-crypto";
import { Order } from "@/types/order";
import { safeAddCrypto } from "@/utils/crypto/arthimetic";
import prepareProfitData from "@/utils/trade/prepare-profit-data";
const lossMyTrade = async (order_id: string): Promise<Order | null> => {
  const { id: user_id } = await getServerSession();

  if (!user_id) throw new Error("Unauthorized");

  // ✅ 1. Get the specific order
  const { data: orderData, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", user_id)
    .eq("id", order_id)
    .eq("on_market", false)
    .single();

  if (fetchError) {
    console.error("Supabase error:", fetchError.message);
    throw new Error(fetchError.message);
  }

  if (!orderData) {
    console.warn("No order found.");
    return null;
  }

  const order = orderData as Order;

  // ✅ 2. Prepare profit data (make sure it returns amount, pnl, status, type, etc.)
  const preparedData = prepareProfitData(order, "withdraw");
  const { amount, pnl, status } = preparedData;

  // ✅ 3. Calculate new amount safely
  const newAmount = safeAddCrypto(amount, pnl);

  // ✅ 4. Update wallet balance
  const walletAction: WalletActionParams = {
    user_id,
    amount: Number(newAmount),
    wallet_type: "USDT",
  };

  await depositCrypto(walletAction);

  // ✅ 5. Update order with new pnl & status
  const { data: updatedOrders, error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      pnl,
      status,
    })
    .eq("user_id", user_id)
    .eq("id", order_id)
    .select("*")
    .single(); // Return updated row directly

  if (updateError) {
    console.error("Update error:", updateError.message);
    throw new Error(updateError.message);
  }

  return updatedOrders as Order;
};

export default lossMyTrade;
