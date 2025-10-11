"use client";

import { useEffect, useState } from "react";

import { ChatMessage } from "@/server/chat/store-message";
import { useRoomsMessages } from "@/queries/chat/use-room-messages";
import { useSendMessage } from "@/queries/chat/use-send-messages";
import { useRealtimeChat } from "@/hooks/use-realtime-chat";
export function useRoomChat(roomName: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // 🗂 Load existing messages
  const { messages: fetchedMessages, isLoading } = useRoomsMessages(roomName);

  // ✉️ Setup send mutation
  const { mutateAsync: sendMutation, isPending } = useSendMessage();

  // ⚡ Setup realtime subscription
  const {
    isConnected,
    username,
    roomName: activeRoom,
  } = useRealtimeChat(roomName);

  // 🧠 Sync messages (from fetch + realtime)
  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  // 🚀 Send message handler
  const sendMessage = async (content: string) => {
    await sendMutation({
      content,
      roomName: activeRoom,
      username,
    });
  };

  return {
    messages,
    sendMessage,
    isLoading,
    isConnected,
    isPending,
  };
}
