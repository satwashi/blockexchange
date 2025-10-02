import {
  User,
  Home,
  ArrowDownCircle,
  ArrowUpCircle,
  List,
  BriefcaseBusiness,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { queryClient } from "@/providers/query-provider";
import { signOut } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "./profile-dialogue";
import { SettingsDialog } from "./settigs-dialogu/settings-dialogue";
import Link from "next/link";
import { UserMenuEntry } from "./UserMenu";

const menuItems: UserMenuEntry[] = [
  // Profile
  {
    type: "component",
    render: (user) => (
      <ProfileDialog user={user}>
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-6 gap-2"
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </ProfileDialog>
    ),
  },

  // Settings
  {
    type: "component",
    render: (user) => (
      <SettingsDialog user={user}>
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SettingsDialog>
    ),
  },

  // Home
  {
    type: "component",
    render: () => (
      <Link href="/">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>
    ),
  },

  {
    type: "component",
    render: (user) => {
      // ✅ Only render if user is admin
      if (user?.role !== "admin") return null;

      return (
        <Link href="/dashboard" passHref>
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start p-2 gap-2"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      );
    },
  },

  // Financial
  {
    type: "component",
    render: () => (
      <Link href="/transactions?transaction=deposit">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <ArrowDownCircle className="mr-2 h-4 w-4 text-green-500" />
          Deposits
        </Button>
      </Link>
    ),
  },
  {
    type: "component",
    render: () => (
      <Link href="/transactions?transaction=withdraw">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <ArrowUpCircle className="mr-2 h-4 w-4 text-red-500" />
          Withdrawals
        </Button>
      </Link>
    ),
  },
  {
    type: "component",
    render: () => (
      <Link href="/orders">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <List className="mr-2 h-4 w-4" />
          Orders
        </Button>
      </Link>
    ),
  },

  // // Content
  // {
  //   type: "component",
  //   render: () => (
  //     <Link href="/blog">
  //       <Button
  //         variant="outline"
  //         size="lg"
  //         className="w-full justify-start p-2 gap-2"
  //       >
  //         <BookOpenText className="mr-2 h-4 w-4" />
  //         Blog
  //       </Button>
  //     </Link>
  //   ),
  // },
  // {
  //   type: "component",
  //   render: () => (
  //     <Link href="/news">
  //       <Button
  //         variant="outline"
  //         size="lg"
  //         className="w-full justify-start p-2 gap-2"
  //       >
  //         <Newspaper className="mr-2 h-4 w-4" />
  //         News
  //       </Button>
  //     </Link>
  //   ),
  // },

  // // Company
  // {
  //   type: "component",
  //   render: () => (
  //     <Link href="/about">
  //       <Button
  //         variant="outline"
  //         size="lg"
  //         className="w-full justify-start p-2 gap-2"
  //       >
  //         <Info className="mr-2 h-4 w-4" />
  //         About Us
  //       </Button>
  //     </Link>
  //   ),
  // },
  {
    type: "component",
    render: () => (
      <Link href="/careers">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start p-2 gap-2"
        >
          <BriefcaseBusiness className="mr-2 h-4 w-4" />
          Careers
        </Button>
      </Link>
    ),
  },

  // Logout
  {
    label: "Log out",
    icon: LogOut,
    onClick: async () => {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            try {
              localStorage.removeItem("impersonatedUserId");
            } catch {}
            queryClient.invalidateQueries({ queryKey: ["session"] });
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          },
        },
      });
    },
    variant: "destructive" as const,
  },
];

export default menuItems;
