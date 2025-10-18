"use client";

import { useRoomsMessages } from "@/queries/chat/use-room-messages";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";

export function useRoomChat(roomName: string, username: string) {
  // 🗂 Load existing messages from DB
  const { messages = [], isLoading } = useRoomsMessages(roomName);

  // ⚡ Setup realtime connection for sending messages
  const { sendMessage, isConnected } = useRealtimeChat({
    roomName,
    username,
  });

  // ✅ FIX: Consider connected if we have messages, even if realtime is still connecting
  const shouldShowConnected = isConnected || messages.length > 0;

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected: shouldShowConnected, // ✅ This is the key fix
  };
}
