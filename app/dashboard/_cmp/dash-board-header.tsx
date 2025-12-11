"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "@/queries/useSession";
import { signOut } from "@/utils/auth-client";
import DashBoardHeaderSkeleton from "./skeletons/dashnoard-header-skeleton";
import useChats from "@/queries/chat/use-chats";
import ThemeToggle from "./theme-toggle";

export default function DashBoardHeader() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  const { totalUnreadCount } = useChats();

  if (isLoading) return <DashBoardHeaderSkeleton />;

  async function logout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  const unreadCount = totalUnreadCount ?? 0;

  return (
    <header className="h-14 min-h-[56px] max-h-14 border-b border-border/50 flex items-center justify-between px-3 sm:px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30 w-full max-w-full">
      {/* Left side */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <SidebarTrigger className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-lg" />
        <h1 className="text-base sm:text-lg font-semibold hidden sm:block">Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Theme Toggle - hidden on small mobile */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* Chat Button */}
        <Link href="/chat" className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold min-w-[14px] h-3.5 flex items-center justify-center rounded-full px-0.5">
                {unreadCount > 99 ? "99" : unreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User Avatar */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent/50 transition-colors flex-shrink-0"
        >
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-[10px] sm:text-xs bg-primary/10 text-primary font-medium">
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-medium leading-tight truncate max-w-[100px]">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </Link>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
