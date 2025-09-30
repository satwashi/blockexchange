"use client";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { LucideIcon } from "lucide-react";
import { UserType } from "@/types/user";
import menuItemsDefault from "./user-menu-items";
import UserInfo from "./user-info";
import { Card } from "@/components/ui/card";

export type UserMenuEntry =
  | {
      type?: "item";
      label: string;
      icon: LucideIcon;
      onClick: () => void;
      variant?: "default" | "destructive";
    }
  | {
      type: "component";
      component: React.ReactNode;
    };

interface UserMenuProps {
  user: UserType;
  items?: UserMenuEntry[];
}

// kept for potential future badge theming

export const UserMenu = ({ user, items }: UserMenuProps) => {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const sourceItems = items ?? menuItemsDefault;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuItems = sourceItems.map((item) => {
    if ((item as any).type === "component") return item;
    const it = item as Extract<UserMenuEntry, { type?: "item" }>;
    return {
      ...it,
      onClick: () => {
        it.onClick();
        if (isMobile) setSheetOpen(false);
      },
    } as UserMenuEntry;
  });

  if (isMobile) {
    return (
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0"
          >
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-80 p-3 sm:p-4 [&_button[aria-label='Close']]:hidden [&_button.absolute.right-4.top-4]:hidden"
        >
          <SheetTitle className="sr-only">Account</SheetTitle>
          <div className="mt-0 space-y-0">
            <UserInfo user={user} />
            <Card className="p-2 mt-4">
              {menuItems.map((item, index) => {
                if ((item as any).type === "component") {
                  return <div key={index}>{(item as any).component}</div>;
                }
                const it = item as Extract<UserMenuEntry, { type?: "item" }>;
                return (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start p-2 gap-2 ${
                      it.variant === "destructive"
                        ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                        : ""
                    }`}
                    onClick={it.onClick}
                  >
                    <it.icon className="h-4 w-4" />
                    {it.label}
                  </Button>
                );
              })}
            </Card>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-0">
          <UserInfo user={user} />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => {
          if ((item as any).type === "component") {
            return <div key={index}>{(item as any).component}</div>;
          }
          const it = item as Extract<UserMenuEntry, { type?: "item" }>;
          return (
            <DropdownMenuItem
              key={index}
              onClick={it.onClick}
              className={`gap-3 cursor-pointer ${
                it.variant === "destructive"
                  ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                  : ""
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
