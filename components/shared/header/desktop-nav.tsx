"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ArrowLeftRight,
  FileText,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/market", label: "Markets", icon: BarChart3 },
  { href: "/trading", label: "Trade", icon: ArrowLeftRight },
  { href: "/orders", label: "Orders", icon: FileText },
  { href: "/wallet", label: "Wallet", icon: Wallet },
];

export default function DesktopNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="hidden md:block">
      {/* Pill-shaped container */}
      <div className="flex items-center gap-1 bg-muted/50 backdrop-blur-sm rounded-full p-1 border border-border/30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                active
                  ? "bg-background text-yellow-500 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
