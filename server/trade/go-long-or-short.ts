"use server";
import { getServerSession } from "../user/users";
import supabaseAdmin from "@/lib/supabaseAdmin";
import deductUSDT from "../wallets/deduct-usdt";
import getUserWallet from "../wallets/get-user-wallet";
import { NewOrder } from "@/types/order";

export default async function goLongOrShort(order: NewOrder) {
  // 1️⃣ Get user session
  const { user, id } = await getServerSession();

  if (!user || !id) {
    throw new Error("Please log in. To Trade");
  }

  // go-long-or-short.ts
  if (user.kyc_status !== "verified") {
    return { requiresKyc: true }; // custom response instead of redirect()
  }

  // attach user_id from session
  order.user_id = id;
  const { amount } = order;

  // console.log(order.profit_range, "Profit Range....");

  // 2 Find USDT wallet
  let userWallet;
  try {
    userWallet = await getUserWallet(id);
  } catch (error) {
    if (error instanceof Error && error.message.includes("No wallets found")) {
      throw new Error("USDT wallet not found. Please contact support.");
    }
    throw error; // Re-throw other errors
  }

  const { balance } = userWallet;

  if (!balance) {
    throw new Error("USDT wallet not found. Please contact support.");
  }

  if (!canMakeTrade(Number(balance), amount)) {
    throw new Error("Not enough USDT. Please deposit or exchange.");
  }
  deductUSDT(id, Number(balance), amount);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([
      {
        ...order,
      },
    ])
    .select("*");

  if (error) {
    console.error("Supabase insert error:", error.message);
    throw new Error(error.message);
  }

  return data; // react-query onSuccess will receive this
}
function canMakeTrade(balance: number, amount: number): boolean {
  return balance >= amount;
}
