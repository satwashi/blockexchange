"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ChatListSidebar } from "@/components/chat/ChatListSidebar";

export default function ChatPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-screen">
        <ChatListSidebar />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center bg-muted/20">
      <div className="text-center">
        <h2 className="font-semibold text-xl mb-2">No chat selected</h2>
        <p className="text-muted-foreground">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}
