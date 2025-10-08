"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { ChatListSidebar } from "@/components/chat/ChatListSidebar";
import { ResizablePanel } from "@/components/chat/resizable-panel";
import { useState } from "react";

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
        <ChatListSidebar width={sidebarWidth} />
        <div className="flex-1 min-h-0">{children}</div>
      </ResizablePanel>
    </div>
  );
}
