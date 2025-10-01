"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import type { Transaction } from "@/types/transactions";

export default async function getMyTransactions(): Promise<Transaction[] | []> {
  const { id: user_id } = await getServerSession();
  if (!user_id) return [];

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my transactions:", error.message);
    return [];
  }

  return (data as Transaction[]) || [];
}
