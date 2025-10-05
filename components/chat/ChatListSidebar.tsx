"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Chat {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isActive: boolean;
}

interface ChatListSidebarProps {
  chats: Chat[];
  width?: number;
}

export function ChatListSidebar({ chats, width }: ChatListSidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(width || 320);
  const router = useRouter();
  const pathname = usePathname();

  // Extract chat ID from current path
  const selectedChatId = pathname.includes("/chat/")
    ? pathname.split("/chat/")[1]
    : null;

  useEffect(() => {
    if (width) {
      setSidebarWidth(width);
    }
  }, [width]);

  const isCollapsed = sidebarWidth < 120;

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {!isCollapsed && (
        <div className="border-b border-border p-4 shrink-0">
          <h1 className="font-semibold text-lg mb-4">Support Chats</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className={cn("p-2", isCollapsed && "px-1")}>
          {chats.map((chat) => {
            const isSelected = selectedChatId === chat.id;

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
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-muted text-sm">
                        {chat.customerName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -bottom-1 -right-1 h-5 min-w-5 px-1.5 text-xs"
                      >
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-sm">
                        {chat.customerName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {chat.customerName}
                        </span>
                        <span className="text-muted-foreground text-xs shrink-0">
                          {chat.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-muted-foreground text-sm truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 min-w-5 shrink-0 px-1.5"
                          >
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {chat.isActive && (
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-green-600 dark:text-green-400 text-xs">
                            Active
                          </span>
                        </div>
                      )}
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
