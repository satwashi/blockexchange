"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useSession } from "@/queries/useSession";

import { signOut } from "@/utils/auth-client";
import DashBoardHeaderSkeleton from "./skeletons/dashnoard-header-skeleton";
import useChats from "@/queries/chat/use-chats";

export default function DashBoardHeader() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const { totalUnreadCount } = useChats();

  if (isLoading) return <DashBoardHeaderSkeleton />;

  const unreadCount = totalUnreadCount;

  async function logout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  }

  return (
    <header className="h-16 z-30 border-b flex items-center justify-between px-6 shadow-sm bg-secondary">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative group">
                <SidebarTrigger className="h-10 w-10 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 border border-border/50 hover:border-border shadow-sm" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-primary text-primary-foreground"
            >
              <p>Toggle Sidebar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Chat Button with Unread Badge */}
        <div className="relative">
          <Link href="/chat">
            <Button variant="ghost" size="icon" aria-label="Chats">
              <MessageCircle className="h-5 w-5 text-foreground transition-transform duration-200 hover:scale-110" />
            </Button>
          </Link>

          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {user?.role}
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Avatar>
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Logout"
          className="text-destructive hover:text-destructive/90"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
