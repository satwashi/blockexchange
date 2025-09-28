"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "@/queries/useSession";
import { signOut } from "@/utils/auth-client";
import DashBoardHeaderSkeleton from "./skeletons/dashnoard-header-skeleton";

export default function DashBoardHeader() {
  const router = useRouter();
  const { user, isLoading } = useSession();
  if (isLoading) return <DashBoardHeaderSkeleton />;
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
    <header className="h-16 z-30 border-b fixed right-0 left-0 flex items-center justify-between px-6 shadow-sm bg-secondary">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

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
