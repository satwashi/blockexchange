"use client";

import supabaseClient from "@/lib/client";
import fetchChats from "@/server/chat/fetch-chats";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

import { useEffect } from "react";

const useChats = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: fetchChats,
    staleTime: Infinity,
  });

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
  }, [queryClient]);

  return { chats: data ?? [], isLoading, error };
};

export default useChats;
