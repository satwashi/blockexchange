"use client";

import { useParams } from "next/navigation";
import AdminChatPage from "@/components/chat/admin-chat";

// Mock data - replace with your actual data source
const mockChats = [
  { id: "chat-1", customerName: "Sarah Johnson" },
  { id: "chat-2", customerName: "Michael Chen" },
  { id: "chat-3", customerName: "Emma Williams" },
  { id: "chat-4", customerName: "James Rodriguez" },
  { id: "chat-5", customerName: "Olivia Brown" },
];

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

  const chat = mockChats.find((c) => c.id === chatId);

  // Use default customer for testing if chat not found
  const customerToUse = chat
    ? {
        id: chat.id,
        name: chat.customerName,
        avatar: "",
        isOnline: true,
        lastMessage: "Ready to chat",
        timestamp: "now",
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
