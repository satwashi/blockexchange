"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";

import { TransactionWithUser } from "@/types/transactions";

const getAllTansactions = async (): Promise<TransactionWithUser[] | []> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch all transactions
  const { data: transactions, error: txError } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (txError) {
    console.error("Error fetching transactions:", txError);
    return [];
  }

  if (!transactions || transactions.length === 0) return [];

  // 2. Get unique user_ids
  const userIds = [...new Set(transactions.map((t) => t.user_id).filter(Boolean))];

  // 3. Fetch users separately
  const { data: users, error: usersError } = await supabaseAdmin
    .from("users")
    .select("id, name")
    .in("id", userIds);

  if (usersError) {
    console.error("Error fetching users:", usersError);
    // Return transactions without user info
    return transactions.map((tx) => ({ ...tx, user: null }));
  }

  // 4. Create a map for quick lookup
  const userMap = new Map(users?.map((u) => [u.id, u]) || []);

  // 5. Merge transactions with user info
  return transactions.map((tx) => ({
    ...tx,
    user: userMap.get(tx.user_id) || null,
  }));
};

export default getAllTansactions;
