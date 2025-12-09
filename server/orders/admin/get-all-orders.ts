"use server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import { OrderWithUser } from "@/types/order";

const getAllOrders = async (): Promise<OrderWithUser[] | []> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch all orders
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return [];
  }

  if (!orders || orders.length === 0) return [];

  // 2. Get unique user_ids
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))];

  // 3. Fetch users separately
  const { data: users, error: usersError } = await supabaseAdmin
    .from("users")
    .select("id, name")
    .in("id", userIds);

  if (usersError) {
    console.error("Error fetching users:", usersError);
    // Return orders without user info
    return orders.map((order) => ({ ...order, user: null }));
  }

  // 4. Create a map for quick lookup
  const userMap = new Map(users?.map((u) => [u.id, u]) || []);

  // 5. Merge orders with user info
  return orders.map((order) => ({
    ...order,
    user: userMap.get(order.user_id) || null,
  }));
};

export default getAllOrders;
