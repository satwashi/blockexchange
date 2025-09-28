"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { Transaction } from "@/types/transactions";
import { getServerSession } from "../../user/users";

import withdrawCrypto, {
  WalletActionParams,
} from "../../wallets/withdraw-crypto";
import depositCrypto from "@/server/wallets/deposit-crypto";

export async function verifyTransaction(
  transactionId: string
): Promise<Transaction> {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized. Only Admin can verify a transaction");
  }

  // 1. Fetch transaction first
  const { data: transaction, error: fetchError } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (fetchError || !transaction) {
    console.error("Transaction lookup failed:", fetchError?.message);
    throw new Error("Transaction not found");
  }

  // Prevent double verification
  if (transaction.status === "verified") {
    throw new Error(`Transaction ${transactionId} is already verified`);
  }

  // 2. Mark transaction as verified
  const { data, error } = await supabaseAdmin
    .from("transactions")
    .update({
      status: "verified",
      verified_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .select()
    .single();

  if (error || !data) {
    console.error("Error verifying transaction:", error?.message);
    throw new Error("Failed to verify transaction");
  }

  const { user_id, wallet_type, amount, transaction_type } = data;

  const cryptoData: WalletActionParams = {
    user_id,
    wallet_type,
    amount,
    type: transaction_type,
  };

  try {
    // 3. Update user wallet balance
    if (transaction_type === "deposit") {
      await depositCrypto(cryptoData);
    } else if (transaction_type === "withdraw") {
      await withdrawCrypto(cryptoData);

      console.log("wothdrwaing");
    }
  } catch (err) {
    console.error("Wallet balance update failed:", err);

    // ⚠️ Rollback transaction status if wallet update fails
    await supabaseAdmin
      .from("transactions")
      .update({
        status: "failed",
        verified_at: null,
      })
      .eq("id", transactionId);

    throw new Error(
      "Transaction verification failed due to wallet update error"
    );
  }

  // ✅ Always return a Transaction — never null
  return data as Transaction;
}
