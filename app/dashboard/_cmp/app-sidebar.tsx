"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
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
  LayoutDashboard,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/queries/useSession";

const mainNavItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Trades", url: "/dashboard/trades", icon: Repeat },
  { title: "Users", url: "/dashboard/users", icon: Users },
];

const transactionItems = [
  { title: "Deposits", url: "/dashboard/transactions/deposits", icon: ArrowDownToLine },
  { title: "Withdrawals", url: "/dashboard/transactions/withdrawals", icon: ArrowUpFromLine },
];

const otherItems = [
  { title: "KYC Verification", url: "/dashboard/kyc", icon: FileCheck },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/dashboard") return pathname === url;
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarContent className="px-3 py-4">
        {/* Logo Section */}
        <LogoSection />

        {/* Main Navigation */}
        <SidebarGroup className="mt-2">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Transactions Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
            Transactions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {transactionItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Section */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {otherItems.map((item) => (
                <NavItem
                  key={item.title}
                  item={item}
                  isActive={isActive(item.url)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-border/50 p-3">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors group"
        >
          <span>View Site</span>
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}

interface NavItemProps {
  item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          href={item.url}
          prefetch={true}
          className={cn(
            "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sm font-medium group",
            isActive
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon
              className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            />
            <span>{item.title}</span>
          </div>
          {isActive && (
            <ChevronRight className="w-4 h-4 text-primary/50" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function LogoSection() {
  const { user } = useSession();

  return (
    <div className="px-3 pb-4 mb-2 border-b border-border/50">
      <div className="flex items-center gap-3">
        {/* Logo Icon */}
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Home className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">BlockExchange</h1>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role ?? "Admin"} Panel
          </p>
        </div>
      </div>
    </div>
  );
}
