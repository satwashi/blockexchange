"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme/theme-togle";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-end px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-9 px-4 text-sm rounded-full hover:scale-105 transition-transform"
          >
            <Link href="/login">Log in</Link>
          </Button>

          <Button
            asChild
            className="h-9 px-4 text-sm rounded-full hover:scale-105 transition-transform"
          >
            <Link href="/signup">Sign up</Link>
          </Button>

          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full rounded-full"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
