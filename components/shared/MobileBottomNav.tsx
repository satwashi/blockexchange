"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  FileText,
  Home,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const leftItems = [
  { icon: Home, id: "home", label: "Home", url: "/" },
  { icon: BarChart3, id: "market", label: "Market", url: "/market" },
];

const rightItems = [
  { icon: FileText, id: "orders", label: "Orders", url: "/orders" },
  { icon: Wallet, id: "wallet", label: "Wallet", url: "/wallet" },
];

const primaryAction = {
  icon: ArrowLeftRight,
  id: "trade",
  label: "Trade",
  url: "/trading",
};

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname.startsWith(url);
  };

  // Hide mobile nav on chat pages
  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-md px-4 pb-4">
        {/* Main navigation container - pill shaped */}
        <div className="relative bg-background/95 backdrop-blur-lg rounded-full border border-border/50 shadow-xl shadow-black/30">
          <div className="flex items-center justify-between h-14 px-4">
            {/* Left icons */}
            <div className="flex items-center gap-4">
              {leftItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
                      active
                        ? "bg-yellow-500/15 text-yellow-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                );
              })}
            </div>

            {/* Center spacer for the floating button */}
            <div className="w-16" />

            {/* Right icons */}
            <div className="flex items-center gap-4">
              {rightItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200",
                      active
                        ? "bg-yellow-500/15 text-yellow-500"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center Trade Button - Floating above */}
          <Link
            href={primaryAction.url}
            className="absolute left-1/2 -translate-x-1/2 -top-5"
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200",
                "bg-background border-4 border-border/30 shadow-lg shadow-black/30",
                "hover:scale-105 active:scale-95",
                isActive(primaryAction.url)
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ArrowLeftRight className="h-6 w-6" strokeWidth={1.5} />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
