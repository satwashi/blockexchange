"use client";

import supabaseClient from "@/lib/client";
import { queryClient } from "@/providers/query-provider";
import fetchChats from "@/server/chat/fetch-chats";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

export interface Chat {
  id: string;
  customer_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

function formatTimestamp(timestamp: string | null) {
  if (!timestamp) return "";
  const diff = (Date.now() - new Date(timestamp).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const useChats = () => {
  const { data, isLoading, error } = useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: fetchChats,
    staleTime: Infinity,
  });

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabaseClient
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Message change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["chats"] });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  // ✅ Compute total unread messages
  const totalUnreadCount = useMemo(() => {
    return (data ?? []).reduce(
      (sum, chat) => sum + (chat.unread_count || 0),
      0
    );
  }, [data]);

  return {
    chats: data ?? [],
    isLoading,
    error,
    totalUnreadCount, // ✅ now available
  };
};

export default useChats;
