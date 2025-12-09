"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import {
  Home,
  Repeat,
  Users,
  Settings,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/queries/useSession";
import Logo from "@/components/shared/header/logo";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Trades", url: "/dashboard/trades", icon: Repeat },
  { title: "Users", url: "/dashboard/users", icon: Users },
  { title: "Deposits", url: "/dashboard/transactions/deposits", icon: ArrowDownToLine },
  { title: "Withdrawals", url: "/dashboard/transactions/withdrawals", icon: ArrowUpFromLine },
  { title: "KYC", url: "/dashboard/kyc", icon: FileCheck },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === url;
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="w-64 border-r border-border/50 bg-background">
      <SidebarContent className="p-4">
        <LogoSection />
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        prefetch={true}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                          "text-sm font-medium",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", active && "text-primary-foreground")} />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function LogoSection() {
  const { user } = useSession();
  
  return (
    <div className="mb-6 pb-4 border-b border-border/50">
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      <p className="text-xs text-muted-foreground mt-2 capitalize">
        {user?.role ?? "user"} Panel
      </p>
    </div>
  );
}
