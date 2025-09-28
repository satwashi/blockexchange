"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import { LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/utils/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/theme/theme-togle";
import { queryClient } from "@/providers/query-provider";
import { useImpersonation } from "@/providers/impersonate-provider";

type UserDropDownProps = UserType & {
  hasDashboardAccess?: boolean;
};

const UserDropDown = ({
  image,
  name,
  username,
  email,
  hasDashboardAccess,
}: UserDropDownProps) => {
  const router = useRouter();

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuLinks = [
    ...(hasDashboardAccess
      ? [
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
        ]
      : []),
  ];
  const { clearLocalImpersonation } = useImpersonation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={image!} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* User Info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {username ? `@${username}` : email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Links */}
        {menuLinks.map(({ href, label, icon }) => (
          <DropdownMenuItem asChild key={href}>
            <Link href={href} className="flex items-center gap-2">
              {icon}
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuItem asChild>
          <div className="flex items-center gap-2 w-full">
            <ModeToggle />
            <span>Theme</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async () => {
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.refresh();
                  clearLocalImpersonation();
                  queryClient.invalidateQueries({ queryKey: ["sesssion"] });
                },
              },
            });
          }}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
