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
import { UserMenuEntry } from "./UserMenu";
import { queryClient } from "@/providers/query-provider";
import { signOut } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";
import { ProfileDialog } from "./profile-dialogue";
import { SettingsDialog } from "./settigs-dialogu/settings-dialogue";

const menuItems: UserMenuEntry[] = [
  {
    type: "component",
    render: (user) => (
      <ProfileDialog user={user}>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start p-2 gap-2  
        }`}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </ProfileDialog>
    ),
  },
  {
    type: "component",
    render: (user) => (
      <SettingsDialog user={user}>
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start p-2 gap-2  
        }`}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SettingsDialog>
    ),
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
