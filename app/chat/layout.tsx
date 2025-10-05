"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ChatListSidebar } from "@/components/chat/ChatListSidebar";
import { ResizablePanel } from "@/components/chat/resizable-panel";
import { useState } from "react";

// Mock data - replace with your actual data source
const mockChats = [
  {
    id: "chat-1",
    customerName: "Sarah Johnson",
    lastMessage: "Thanks for your help!",
    timestamp: "2m ago",
    unreadCount: 2,
    isActive: true,
  },
  {
    id: "chat-2",
    customerName: "Michael Chen",
    lastMessage: "When will my order arrive?",
    timestamp: "15m ago",
    unreadCount: 1,
    isActive: true,
  },
  {
    id: "chat-3",
    customerName: "Emma Williams",
    lastMessage: "I need to update my billing info",
    timestamp: "1h ago",
    unreadCount: 0,
    isActive: false,
  },
  {
    id: "chat-4",
    customerName: "James Rodriguez",
    lastMessage: "The product is exactly what I needed",
    timestamp: "2h ago",
    unreadCount: 0,
    isActive: false,
  },
  {
    id: "chat-5",
    customerName: "Olivia Brown",
    lastMessage: "Can I get a refund?",
    timestamp: "3h ago",
    unreadCount: 3,
    isActive: true,
  },
];

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div className="h-screen">
      <ResizablePanel defaultSize={320} minSize={80} maxSize={500}>
        <ChatListSidebar chats={mockChats} width={sidebarWidth} />
        <div className="flex-1 min-h-0">{children}</div>
      </ResizablePanel>
    </div>
  );
}
