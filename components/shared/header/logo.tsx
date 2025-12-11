"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Go to home"
      className="flex items-center gap-2.5 group"
    >
      {/* Modern geometric logo */}
      <div className="relative">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow duration-300">
          <Hexagon className="h-5 w-5 text-background" strokeWidth={2} />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 h-9 w-9 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
      </div>
      
      <div className="flex flex-col">
        <span className="text-lg font-bold tracking-tight text-foreground leading-none">
          Blocke<span className="text-yellow-500">change</span>
        </span>
        <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase hidden sm:block">
          Trade Smart
        </span>
      </div>
    </Link>
  );
}
