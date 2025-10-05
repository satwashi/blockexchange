"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  // SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "../../../components/ui/button";
import {
  Home,
  Repeat,
  Users,
  Settings,
  CreditCard,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/queries/useSession";
import Logo from "../../../components/shared/header/logo";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getNavClass = (url: string) => {
    const isActive = pathname === url;
    return cn(
      "flex justify-start items-center py-2 rounded-lg transition-all duration-200 p-2",
      isActive
        ? "bg-primary text-whi shadow-lg"
        : "text-gray-700 hover:bg-gray-100"
    );

    // return "flex justify-start items-center";
  };

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Trades",
      url: "/dashboard/trades",
      icon: Repeat, // better than ArrowLeftRight
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Withdrawals",
      url: "/dashboard/transactions/withdrawals",
      icon: CreditCard,
    },
    {
      title: "Deposits",
      url: "/dashboard/transactions/deposits",
      icon: CreditCard,
    },
    {
      title: "KYC",
      url: "/dashboard/kyc",
      icon: FileCheck, // more relevant than CreditCard
    },
  ];

  return (
    <Sidebar className="w-64 z-50  border-r border-gray-200 shadow-sm">
      <SidebarContent className="p-4">
        <LogoSection />
        <SidebarGroup>
          {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant="ghost"
                      // type="button"
                      className={getNavClass(item.url)}
                      onClick={() => router.push(item.url)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <ContactSupport /> */}
      </SidebarContent>
    </Sidebar>
  );
}

// function ContactSupport() {
//   return (
//     <Card className="mt-auto pt-8">
//       <div className="p-4   ">
//         <p className="text-sm font-medium mb-1">Need Help?</p>
//         <p className="text-xs  mb-3">Contact our support team</p>
//         <button className="text-xs  hover:text-primary font-medium">
//           Get Support →
//         </button>
//       </div>
//     </Card>
//   );
// }

function LogoSection() {
  const { user } = useSession();
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role ?? "user"} Panel
          </p>
        </div>
        <SidebarTrigger />
      </div>
    </div>
  );
}
