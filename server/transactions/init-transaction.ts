"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { InitTransactionParams, Transaction } from "@/types/transactions";
import checkSufficiency from "../wallets/check-suffiecency";
import { getServerSession } from "../user/users";

function generateTransactionId(): string {
  const prefix = "TXN";
  const datePart = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

export default async function initTransaction({
  wallet_type,
  amount,
  transaction_type,
  address,
  image,
}: InitTransactionParams): Promise<Transaction | null> {
  const { id: user_id } = await getServerSession();
  if (!user_id) {
    throw new Error("No session. Please login!");
  }

  if (amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (transaction_type === "withdraw") {
    const sufficient = await checkSufficiency({
      user_id,
      wallet_type,
      amount,
    });
    if (!sufficient) {
      throw new Error("Insufficient balance for withdrawal");
    }
  }

  // Generate custom transaction ID
  const customId = generateTransactionId();

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .insert({
      id: customId, // requires "id" column to be text (UUID/string)
      user_id,
      wallet_type,
      amount,
      address,
      image,
      transaction_type,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating transaction:", error.message);
    return null;
  }

  return data as Transaction;
}
