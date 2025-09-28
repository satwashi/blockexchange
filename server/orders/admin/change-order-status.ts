"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import { Order } from "@/types/order";

type ChangeOrderStatus = {
  pnl: number;
  status: "CLOSED" | "OPEN";
};

const changeOrderStatus = async (
  data: ChangeOrderStatus,
  user_id: string,
  order_id: string
): Promise<Order[] | []> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const { data: updatedData, error } = await supabaseAdmin
    .from("orders")
    .update([data])
    .eq("user_id", user_id)
    .eq("id", order_id)
    .select("*");

  if (error) {
    console.error("Supabase  error:", error.message);
    throw new Error(error.message);
  }

  return updatedData; // react-query onSuccess will receive this
};

export default changeOrderStatus;
