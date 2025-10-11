"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "@/lib/client";
import { ChatMessage } from "@/server/chat/store-message";
import { useSession } from "@/queries/useSession";

const EVENT_MESSAGE_TYPE = "message";

export function useRealtimeChat(roomNameOverride?: string) {
  const queryClient = useQueryClient();
  const { id: sessionRoomName, name: username } = useSession();
  const roomName = roomNameOverride ?? sessionRoomName;

  const seenIdsRef = useRef<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomName) return;

    const channel = supabase.channel(roomName);

    channel
      .on("broadcast", { event: EVENT_MESSAGE_TYPE }, (payload) => {
        const incoming = payload.payload as ChatMessage;
        const incomingId = String(incoming.id);

        // prevent duplicates
        if (seenIdsRef.current.has(incomingId)) return;
        seenIdsRef.current.add(incomingId);

        // 🔥 update react-query cache
        queryClient.setQueryData<ChatMessage[]>(
          ["roomMessages", roomName],
          (old) => {
            const existing = old ?? [];
            if (existing.some((m) => String(m.id) === incomingId))
              return existing;
            return [...existing, incoming];
          }
        );
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setIsConnected(true);
        if (status === "CLOSED" || status === "CHANNEL_ERROR")
          setIsConnected(false);
      });

    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [roomName, queryClient]);

  return { username, roomName, isConnected };
}
