"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardBtn() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/dashboard");

  return (
    <Link
      href="/dashboard"
      aria-label="Dashboard"
      className={cn(
        "hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "border border-border/50 hover:border-yellow-500/50",
        isActive
          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
      <span className="hidden lg:inline">Dashboard</span>
    </Link>
  );
}
