"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, X } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme/theme-togle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          href="/login"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            "border border-transparent hover:border-border/50"
          )}
        >
          <LogIn className="h-4 w-4" strokeWidth={1.5} />
          <span>Log in</span>
        </Link>

        <Link
          href="/signup"
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "bg-gradient-to-r from-yellow-400 to-yellow-500 text-background",
            "hover:from-yellow-500 hover:to-yellow-600",
            "shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
          )}
        >
          <UserPlus className="h-4 w-4" strokeWidth={1.5} />
          <span>Sign up</span>
        </Link>

        <ModeToggle />
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-2">
        <ModeToggle />

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200",
                "bg-muted/50 text-muted-foreground hover:text-foreground",
                "border border-border/30 hover:border-border/50"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px] border-border/50">
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-8">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "border border-border/50 hover:border-border hover:bg-muted/50"
                )}
              >
                <LogIn className="h-5 w-5" strokeWidth={1.5} />
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                  "bg-gradient-to-r from-yellow-400 to-yellow-500 text-background",
                  "hover:from-yellow-500 hover:to-yellow-600",
                  "shadow-lg shadow-yellow-500/20"
                )}
              >
                <UserPlus className="h-5 w-5" strokeWidth={1.5} />
                Sign up
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
