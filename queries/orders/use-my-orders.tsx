"use client";

import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/client";
import getMyOrders from "@/server/orders/admin/get-my-orders";

const useMyOrders = (user_id: string) => {
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-orders", user_id],
    queryFn: () => getMyOrders(user_id),
    enabled: !!user_id, // ✅ don't run until user_id is available
  });

  // 🧠 Memoize filtering to avoid recalculating on every render
  const { openOrders, closedOrders } = useMemo(() => {
    if (!orders) return { openOrders: [], closedOrders: [] };

    return {
      openOrders: orders.filter((order: any) => order.status === "OPEN"),
      closedOrders: orders.filter((order: any) => order.status === "CLOSED"),
    };
  }, [orders]);

  useEffect(() => {
    if (!user_id) return;

    const channel = supabase
      .channel("my-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user_id}`, // ✅ listen only for this user's orders
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["my-orders", user_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user_id]);

  return {
    orders, // all orders
    openOrders, // only open orders
    closedOrders, // only closed orders
    isLoading,
    error,
    refetch,
  };
};

export default useMyOrders;
