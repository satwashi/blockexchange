"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useChats from "@/queries/chat/use-chats";
import Logo from "../shared/header/logo";
import { useRoomChat } from "@/hooks/use-room-chat";

interface ChatListSidebarProps {
  width?: number;
}

// Helper function to format time like "8:31 AM" from your image
function formatTimeLikeImage(timeString: string): string {
  // If it's already in the correct format, return as is
  if (timeString.includes("AM") || timeString.includes("PM")) {
    return timeString;
  }

  // If it's a Date object or ISO string, format it
  const date = new Date(timeString);
  if (isNaN(date.getTime())) {
    return timeString; // Return original if not a valid date
  }

  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(" ", " "); // Results in "8:31 AM" format
}

export function ChatListSidebar({ width }: ChatListSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(width || 320);
  const router = useRouter();
  const pathname = usePathname();
  // Extract chat ID from current path
  const selectedChatId = pathname.includes("/chat/")
    ? pathname.split("/chat/")[1]
    : null;
  const { isConnected } = useRoomChat(selectedChatId, "test");

  useEffect(() => {
    if (width) {
      setSidebarWidth(width);
    }
  }, [width]);

  const isCollapsed = sidebarWidth < 200;
  const isVeryCollapsed = sidebarWidth < 120;
  const { chats, isLoading } = useChats();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div
        className={cn(
          "bg-card border-b border-border p-4 h-16 shrink-0 flex items-center",
          isCollapsed && "justify-center p-2"
        )}
      >
        {isCollapsed ? (
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">M</span>
          </div>
        ) : (
          <Logo />
        )}
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className={cn("p-2", isCollapsed && "px-1")}>
          {chats.map((chat) => {
            const isSelected = selectedChatId === chat.id;
            const formattedTime = formatTimeLikeImage(chat.last_message_time);

            return (
              <button
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className={cn(
                  "block w-full rounded-lg p-3 text-left transition-colors hover:bg-accent relative",
                  isSelected && "bg-accent",
                  isCollapsed && "p-2 flex justify-center"
                )}
              >
                {isCollapsed ? (
                  // Collapsed view - avatar only with badge
                  <div className="relative">
                    <Avatar
                      className={cn(
                        "bg-muted",
                        isVeryCollapsed ? "h-10 w-10" : "h-12 w-12"
                      )}
                    >
                      <AvatarFallback className="bg-muted text-sm">
                        {chat.customer_name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unread_count > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-xs border-2 border-background"
                      >
                        {chat.unread_count}
                      </Badge>
                    )}
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                  </div>
                ) : (
                  // Expanded view - full chat item
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted text-sm">
                          {chat.customer_name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm truncate">
                          {chat.customer_name}
                        </span>
                        <span className="text-muted-foreground text-xs shrink-0">
                          {formattedTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-muted-foreground text-sm truncate">
                          {chat.last_message}
                        </p>
                        {chat.unread_count > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 min-w-5 shrink-0 px-1.5 text-xs"
                          >
                            {chat.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
