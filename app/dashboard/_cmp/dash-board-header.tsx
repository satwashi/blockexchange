"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
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

  async function logout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  return (
    <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg" />
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Chat Button */}
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <MessageCircle className="h-4 w-4" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </Button>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-2 px-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-tight">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
