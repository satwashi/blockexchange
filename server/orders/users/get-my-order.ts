"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import { Order } from "@/types/order";

const getMyOrders = async (): Promise<Order[] | null> => {
  const { id } = await getServerSession();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return null;
  }

  return data || [];
};

export default getMyOrders;
