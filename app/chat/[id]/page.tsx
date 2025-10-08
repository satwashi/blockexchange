"use client";

import { useParams } from "next/navigation";
import AdminChatPage from "@/components/chat/admin-chat";
import useChats from "@/queries/chat/use-chats";

// Default customer for testing connection
const defaultCustomer = {
  id: "4",
  name: "Test Customer",
  avatar: "",
  isOnline: true,
  lastMessage: "Hello, how can I help you?",
  timestamp: "now",
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { chats, isLoading } = useChats();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading chat...</div>
      </div>
    );
  }

  const chat = chats.find((c) => c.id === chatId);

  // Use default customer for testing if chat not found
  const customerToUse = chat
    ? {
        id: chat.id,
        name: chat.customer_name,
        avatar: "",
        isOnline: true,
        lastMessage: chat.last_message,
        timestamp: chat.last_message_time,
      }
    : defaultCustomer;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Chat content */}
      <div className="flex-1 min-h-0">
        <AdminChatPage customer={customerToUse} />
      </div>
    </div>
  );
}
