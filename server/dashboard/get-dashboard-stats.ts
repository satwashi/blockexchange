"use server";

import supabaseAdmin from "@/lib/supabaseAdmin";
import { getServerSession } from "@/server/user/users";
import {
  DashboardStats,
  TrendDataPoint,
  RecentActivity,
} from "@/types/dashboard";

// Helper to get date ranges
const getDateRanges = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    today: today.toISOString(),
    weekAgo: weekAgo.toISOString(),
    monthAgo: monthAgo.toISOString(),
  };
};

// Generate last 7 days for trend data
const getLast7Days = (): string[] => {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }
  return days;
};

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    console.error("Dashboard stats: Unauthorized access attempt");
    throw new Error("Unauthorized");
  }

  const { today, weekAgo, monthAgo } = getDateRanges();

  try {
    // 1. Fetch all users (excluding admins) - using "users" table (plural)
    const { data: allUsers, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id, created_at, role");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      // Continue with empty array instead of failing
    }

    // Filter out admins manually
    const users = (allUsers || []).filter(
      (u) => u.role !== "admin" && u.role !== "superadmin"
    );

    const totalUsers = users.length;
    const newUsersToday = users.filter(
      (u) => u.created_at && new Date(u.created_at) >= new Date(today)
    ).length;
    const newUsersThisWeek = users.filter(
      (u) => u.created_at && new Date(u.created_at) >= new Date(weekAgo)
    ).length;

    // Get non-admin user IDs for filtering other queries
    const nonAdminUserIds = users.map((u) => u.id);

    // 2. Fetch orders (only from non-admin users)
    const { data: allOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, amount, created_at, status")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
    }

    // Filter orders to only include non-admin users
    const orders = (allOrders || []).filter(
      (o) => o.user_id && nonAdminUserIds.includes(o.user_id)
    );

    // Calculate active traders
    const tradersLast24h = new Set(
      orders
        .filter((o) => o.created_at && new Date(o.created_at) >= new Date(today))
        .map((o) => o.user_id)
    );
    const tradersLast7d = new Set(
      orders
        .filter((o) => o.created_at && new Date(o.created_at) >= new Date(weekAgo))
        .map((o) => o.user_id)
    );

    // Calculate volumes
    const dailyVolume = orders
      .filter((o) => o.created_at && new Date(o.created_at) >= new Date(today))
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const weeklyVolume = orders
      .filter((o) => o.created_at && new Date(o.created_at) >= new Date(weekAgo))
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const monthlyVolume = orders
      .filter((o) => o.created_at && new Date(o.created_at) >= new Date(monthAgo))
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    // 3. Fetch transactions (only from non-admin users)
    const { data: allTransactions, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, amount, transaction_type, status, created_at")
      .order("created_at", { ascending: false });

    if (txError) {
      console.error("Error fetching transactions:", txError);
    }

    // Filter transactions to only include non-admin users
    const transactions = (allTransactions || []).filter(
      (t) => t.user_id && nonAdminUserIds.includes(t.user_id)
    );

    const pendingWithdrawals = transactions.filter(
      (t) => t.transaction_type === "withdraw" && t.status === "pending"
    ).length;

    const pendingDeposits = transactions.filter(
      (t) => t.transaction_type === "deposit" && t.status === "pending"
    ).length;

    // 4. Fetch pending KYC count (only non-admin users)
    const { data: kycUsers, error: kycError } = await supabaseAdmin
      .from("users")
      .select("id, kyc_status, role")
      .eq("kyc_status", "pending");

    if (kycError) {
      console.error("Error fetching KYC users:", kycError);
    }

    const pendingKycCount = (kycUsers || []).filter(
      (u) => u.role !== "admin" && u.role !== "superadmin"
    ).length;

    // 5. Fetch open chat/support tickets using the chat_rooms_summary view
    let openSupportTickets = 0;
    try {
      const { data: openChats, error: chatsError } = await supabaseAdmin
        .from("chat_rooms_summary")
        .select("id, unread_count");

      if (chatsError) {
        console.error("Error fetching chat rooms:", chatsError);
      } else {
        // Count chats with unread messages as "open" tickets
        openSupportTickets = (openChats || []).filter(
          (c) => c.unread_count > 0
        ).length;
      }
    } catch (e) {
      console.error("Chat rooms query failed:", e);
    }

    // 6. Calculate trend data (last 7 days)
    const last7Days = getLast7Days();

    const userTrends: TrendDataPoint[] = last7Days.map((date) => ({
      date,
      value: users.filter(
        (u) => u.created_at && u.created_at.split("T")[0] === date
      ).length,
    }));

    const volumeTrends: TrendDataPoint[] = last7Days.map((date) => ({
      date,
      value: orders
        .filter((o) => o.created_at && o.created_at.split("T")[0] === date)
        .reduce((sum, o) => sum + (o.amount || 0), 0),
    }));

    const tradeTrends: TrendDataPoint[] = last7Days.map((date) => ({
      date,
      value: orders.filter(
        (o) => o.created_at && o.created_at.split("T")[0] === date
      ).length,
    }));

    // Revenue calculation (assuming 0.1% fee on trades - adjust as needed)
    const FEE_RATE = 0.001;
    const totalFees = orders.reduce(
      (sum, o) => sum + (o.amount || 0) * FEE_RATE,
      0
    );
    const dailyFees = dailyVolume * FEE_RATE;
    const weeklyFees = weeklyVolume * FEE_RATE;
    const monthlyFees = monthlyVolume * FEE_RATE;

    return {
      users: {
        totalUsers,
        newUsersToday,
        newUsersThisWeek,
        activeTraders24h: tradersLast24h.size,
        activeTraders7d: tradersLast7d.size,
      },
      volume: {
        dailyVolume,
        weeklyVolume,
        monthlyVolume,
        totalTrades: orders.length,
      },
      revenue: {
        totalFees,
        dailyFees,
        weeklyFees,
        monthlyFees,
      },
      pending: {
        pendingKyc: pendingKycCount,
        pendingWithdrawals,
        pendingDeposits,
        openSupportTickets,
      },
      trends: {
        users: userTrends,
        volume: volumeTrends,
        trades: tradeTrends,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};

export const getRecentActivity = async (): Promise<RecentActivity[]> => {
  const { isAdmin } = await getServerSession();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  try {
    // Get non-admin users first - using "users" table (plural)
    const { data: allUsers, error: usersError } = await supabaseAdmin
      .from("users")
      .select("id, name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (usersError) {
      console.error("Error fetching users for activity:", usersError);
    }

    const nonAdminUsers = (allUsers || []).filter(
      (u) => u.role !== "admin" && u.role !== "superadmin"
    );
    const nonAdminUserIds = nonAdminUsers.map((u) => u.id);
    const userMap = new Map(nonAdminUsers.map((u) => [u.id, u.name || "User"]));

    const activities: RecentActivity[] = [];

    // Recent signups (non-admin)
    const recentSignups = nonAdminUsers.slice(0, 5);
    recentSignups.forEach((user) => {
      if (user.created_at) {
        activities.push({
          id: `signup-${user.id}`,
          type: "signup",
          description: "New user signed up",
          userName: user.name || "New User",
          timestamp: user.created_at,
        });
      }
    });

    // Recent orders
    const { data: recentOrders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("id, user_id, amount, symbol, side, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (ordersError) {
      console.error("Error fetching recent orders:", ordersError);
    }

    (recentOrders || [])
      .filter((o) => o.user_id && nonAdminUserIds.includes(o.user_id))
      .slice(0, 5)
      .forEach((order) => {
        if (order.created_at) {
          activities.push({
            id: `trade-${order.id}`,
            type: "trade",
            description: `${order.side || "Trade"} ${order.symbol || ""}`,
            userName: userMap.get(order.user_id) || "User",
            amount: order.amount,
            timestamp: order.created_at,
          });
        }
      });

    // Recent transactions
    const { data: recentTx, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, amount, transaction_type, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (txError) {
      console.error("Error fetching recent transactions:", txError);
    }

    (recentTx || [])
      .filter((t) => t.user_id && nonAdminUserIds.includes(t.user_id))
      .slice(0, 5)
      .forEach((tx) => {
        if (tx.created_at) {
          activities.push({
            id: `tx-${tx.id}`,
            type: tx.transaction_type === "deposit" ? "deposit" : "withdrawal",
            description: `${tx.transaction_type === "deposit" ? "Deposit" : "Withdrawal"} request`,
            userName: userMap.get(tx.user_id) || "User",
            amount: tx.amount,
            timestamp: tx.created_at,
          });
        }
      });

    // Sort by timestamp and return top 10
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};
