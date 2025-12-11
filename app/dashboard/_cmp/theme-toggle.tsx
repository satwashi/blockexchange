"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[72px] h-9 rounded-full bg-muted/50 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center w-[72px] h-9 rounded-full p-1 transition-colors duration-300",
        isDark ? "bg-zinc-800" : "bg-zinc-200"
      )}
      aria-label="Toggle theme"
    >
      {/* Sliding indicator */}
      <div
        className={cn(
          "absolute w-7 h-7 rounded-full shadow-md transition-all duration-300 ease-out",
          isDark
            ? "translate-x-[36px] bg-zinc-900"
            : "translate-x-0 bg-white"
        )}
      />

      {/* Icons */}
      <div className="relative flex items-center justify-between w-full px-1.5 z-10">
        <Sun
          className={cn(
            "w-4 h-4 transition-colors duration-300",
            isDark ? "text-zinc-500" : "text-amber-500"
          )}
        />
        <Moon
          className={cn(
            "w-4 h-4 transition-colors duration-300",
            isDark ? "text-blue-400" : "text-zinc-400"
          )}
        />
      </div>
    </button>
  );
}

