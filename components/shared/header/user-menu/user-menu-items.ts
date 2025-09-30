import {
  Shield,
  Bell,
  CreditCard,
  Settings,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { UserMenuItem } from "./UserMenu";
import { queryClient } from "@/providers/query-provider";
import { signOut } from "@/utils/auth-client";

const menuItems: UserMenuItem[] = [
  {
    label: "Profile",
    icon: User,
    onClick: () => toast.success("Profile clicked"),
    variant: "default" as const,
  },
  {
    label: "Settings",
    icon: Settings,
    onClick: () => toast.success("Settings clicked"),
    variant: "default" as const,
  },
  {
    label: "Billing",
    icon: CreditCard,
    onClick: () => toast.success("Billing clicked"),
    variant: "default" as const,
  },
  {
    label: "Notifications",
    icon: Bell,
    onClick: () => toast.success("Notifications clicked"),
  },
  {
    label: "Security",
    icon: Shield,
    onClick: () => toast.success("Security clicked"),
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    onClick: () => toast.success("Help clicked"),
  },
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
