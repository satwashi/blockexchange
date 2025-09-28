"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "../user/users";

async function createUserWallets() {
  const { id } = await getServerSession();
  // 1. Fetch all wallets
  const { data: wallets, error: walletsError } = await supabaseAdmin
    .from("wallets")
    .select("symbol");

  if (walletsError) {
    console.error("Error fetching wallets:", walletsError);
    return;
  }

  // 2. Prepare rows for user_wallets
  const userWallets = wallets.map((wallet) => ({
    user_id: id,
    wallet_type: wallet.symbol,
    balance: 0, // starting balance
  }));

  // 3. Insert into user_wallets
  const { data, error } = await supabaseAdmin
    .from("user_wallets")
    .insert(userWallets);

  if (error) {
    console.error("Error inserting user_wallets:", error);
  } else {
    console.log("User wallets created:", data);
  }
}

export default createUserWallets;
