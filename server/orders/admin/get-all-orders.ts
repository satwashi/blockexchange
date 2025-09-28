"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import { Order } from "@/types/order";

const getAllOrders = async (): Promise<Order[] | []> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
};

export default getAllOrders;
