"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";

import { Transaction } from "@/types/transactions";

const getAllTansactions = async (): Promise<Transaction[] | []> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
};

export default getAllTansactions;
