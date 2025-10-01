"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DesktopNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/market", label: "Markets" },
    { href: "/trading", label: "Trade" },
    { href: "/orders", label: "Orders" },
    { href: "/wallet", label: "Wallet" },
  ];

  return (
    <nav className="hidden md:flex space-x-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={`relative text-sm font-medium transition-colors ${
              isActive
                ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-primary"
                : "text-muted-foreground hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:after:w-full after:transition-all"
            }`}
            asChild
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
