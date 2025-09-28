"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import getUserWallet from "./get-user-wallet";
import { WalletActionParams } from "./withdraw-crypto";

export default async function depositCrypto({
  user_id,
  wallet_type,
  amount,
}: WalletActionParams) {
  // const { isAdmin } = await getServerSession();

  // if (!isAdmin) {
  //   throw new Error("Unauthorized. Please log in.");
  // }

  const { data, error } = await supabaseAdmin.rpc("increment_wallet_balance", {
    p_user_id: user_id,
    p_wallet_type: wallet_type,
    p_amount: amount,
  });

  if (error) {
    console.error(`Failed to deposit ${wallet_type} :`, error.message);
    throw new Error(`Could not deposit ${wallet_type} from wallet.`);
  }

  return data;
}
