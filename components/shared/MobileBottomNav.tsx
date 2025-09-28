"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, TrendingUp, BarChart3, List, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string; // add path to navigate to
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Market", path: "/market" },
  { icon: BarChart3, label: "Trade", path: "/trading" },
  { icon: List, label: "Orders", path: "/orders" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
];

export function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur border-t">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-2 px-3"
              onClick={() => router.push(item.path)}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "text-yellow-500" : ""}`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-yellow-500" : ""
                }`}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
