"use client";

import { RealtimeChat } from "@/components/realtime-chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ChatMessage } from "@/hooks/use-realtime-chat";

interface ChatWindowProps {
  roomName: string;
  username: string;
  onBack?: () => void;
  showBackButton?: boolean;
  messages?: ChatMessage[];
  onMessage?: (messages: ChatMessage[]) => void;
}

export function ChatWindow({
  roomName,
  username,
  onBack,
  showBackButton = false,
  messages = [],
  onMessage,
}: ChatWindowProps) {
  return (
    <div className="flex h-full flex-col bg-background">
      {showBackButton && (
        <div className="border-b border-border bg-card px-4 py-3 lg:hidden">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to chats
          </Button>
        </div>
      )}
      <RealtimeChat
        roomName={roomName}
        username={username}
        messages={messages}
        onMessage={onMessage}
      />
    </div>
  );
}
