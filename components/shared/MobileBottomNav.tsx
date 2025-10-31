"use client";

import { usePathname } from "next/navigation";
import { Home, TrendingUp, BarChart3, List, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Market", path: "/market" },
  { icon: BarChart3, label: "Trade", path: "/trading" },
  { icon: List, label: "Orders", path: "/orders" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide mobile nav on chat pages
  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur border-t bg-background h-[58px] supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),0px)]"
    >
      <div className="flex items-stretch justify-around h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              asChild
              className={`
                relative flex flex-col items-center justify-center gap-0.5 h-full py-1 px-2 leading-none
                transition-all
                hover:text-primary     /* for desktop */
                active:scale-95        /* for mobile tap feedback */
                active:text-primary
              `}
            >
              <Link href={item.path}>
                <Icon className={`h-5 w-5 ${isActive ? "text-yellow-500" : ""}`} />
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-yellow-500" : ""
                  }`}
                >
                  {item.label}
                </span>

                {/* underline indicator for active page */}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-2 right-2 h-[2px] bg-yellow-500 rounded-full" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
