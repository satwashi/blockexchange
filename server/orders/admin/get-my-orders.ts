"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { Order } from "@/types/order";

const getMyOrders = async (user_id: string): Promise<Order[] | []> => {
  if (!user_id) {
    throw new Error("Please Login First");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("user_id", user_id);

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
};

export default getMyOrders;
