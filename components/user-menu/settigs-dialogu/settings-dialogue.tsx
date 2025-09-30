// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import type { ReactNode } from "react";
// import type { UserType } from "@/types/user";
// import { useSession } from "@/queries/useSession";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type EditableFieldKey = "name" | "email" | "withdrawal_password";

// export default function SettingsDialogue({
//   children,
//   user: passedUser,
// }: {
//   children: ReactNode;
//   user?: UserType;
// }) {
//   const { user: sessionUser } = useSession();
//   const user = useMemo(
//     () => passedUser ?? sessionUser,
//     [passedUser, sessionUser]
//   );

//   const [open, setOpen] = useState(false);

//   // Local state mirrors for inline editing
//   const [name, setName] = useState<string>(user?.name || "");
//   const [email, setEmail] = useState<string>(user?.email || "");
//   const [withdrawalPassword, setWithdrawalPassword] = useState<string>("");

//   const [editing, setEditing] = useState<EditableFieldKey | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (!user) return;
//     setName(user.name || "");
//     setEmail(user.email || "");
//   }, [user]);

//   useEffect(() => {
//     if (editing && inputRef.current) {
//       inputRef.current.focus();
//       inputRef.current.select?.();
//     }
//   }, [editing]);

//   const handleCommit = (key: EditableFieldKey) => {
//     setEditing(null);
//     switch (key) {
//       case "name":
//         toast.info("Updating name…");
//         break;
//       case "email":
//         toast.info("Updating email…");
//         break;
//       case "withdrawal_password":
//         toast.info("Updating withdrawal password…");
//         break;
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="sm:max-w-[520px]">
//         <DialogHeader>
//           <DialogTitle>Account Settings</DialogTitle>
//           <DialogDescription>
//             Manage your profile and security.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Name */}
//           <div className="space-y-2">
//             <Label htmlFor="name">Name</Label>
//             {editing === "name" ? (
//               <Input
//                 id="name"
//                 ref={inputRef}
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 onBlur={() => handleCommit("name")}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCommit("name");
//                   if (e.key === "Escape") setEditing(null);
//                 }}
//               />
//             ) : (
//               <button
//                 type="button"
//                 className="text-left w-full px-3 py-2 rounded-md border hover:bg-accent/50"
//                 onClick={() => setEditing("name")}
//               >
//                 {name || "—"}
//               </button>
//             )}
//           </div>

//           {/* Email (visible, editable UX; updates not wired yet) */}
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             {editing === "email" ? (
//               <Input
//                 id="email"
//                 type="email"
//                 ref={inputRef}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onBlur={() => handleCommit("email")}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCommit("email");
//                   if (e.key === "Escape") setEditing(null);
//                 }}
//               />
//             ) : (
//               <button
//                 type="button"
//                 className="text-left w-full px-3 py-2 rounded-md border hover:bg-accent/50"
//                 onClick={() => setEditing("email")}
//               >
//                 {email || "—"}
//               </button>
//             )}
//           </div>

//           {/* Withdrawal password */}
//           <div className="space-y-2">
//             <Label htmlFor="withdrawal_password">Withdrawal password</Label>
//             {editing === "withdrawal_password" ? (
//               <Input
//                 id="withdrawal_password"
//                 type="password"
//                 ref={inputRef}
//                 value={withdrawalPassword}
//                 onChange={(e) => setWithdrawalPassword(e.target.value)}
//                 onBlur={() => handleCommit("withdrawal_password")}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleCommit("withdrawal_password");
//                   if (e.key === "Escape") setEditing(null);
//                 }}
//               />
//             ) : (
//               <button
//                 type="button"
//                 className="text-left w-full px-3 py-2 rounded-md border hover:bg-accent/50"
//                 onClick={() => setEditing("withdrawal_password")}
//               >
//                 {withdrawalPassword ? "••••••••" : "Set withdrawal password"}
//               </button>
//             )}
//           </div>

//           {/* Nested dialog: update login password */}
//           <UpdateLoginPasswordDialog>
//             <Button variant="outline" className="w-full">
//               Update login password
//             </Button>
//           </UpdateLoginPasswordDialog>
//         </div>

//         <div className="flex justify-end gap-2 pt-2">
//           <Button variant="ghost" onClick={() => setOpen(false)}>
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function UpdateLoginPasswordDialog({ children }: { children: ReactNode }) {
//   const [open, setOpen] = useState(false);
//   const [password, setPassword] = useState("");
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   useEffect(() => {
//     if (open) setTimeout(() => inputRef.current?.focus(), 0);
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{children}</DialogTrigger>
//       <DialogContent className="sm:max-w-[420px]">
//         <DialogHeader>
//           <DialogTitle>Update login password</DialogTitle>
//           <DialogDescription>Enter a new account password.</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-2">
//           <Label htmlFor="new_password">New password</Label>
//           <Input
//             id="new_password"
//             type="password"
//             ref={inputRef}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 toast.info("Updating login password…");
//                 setOpen(false);
//               }
//             }}
//           />
//         </div>
//         <div className="flex justify-end gap-2 pt-2">
//           <Button
//             onClick={() => {
//               toast.info("Updating login password…");
//               setOpen(false);
//             }}
//           >
//             Save
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, type ReactNode } from "react";
import type { UserType } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  // Settings,
  User,
  Lock,
  ShieldCheck,
  FileText,
  Bell,
  Mail,
  Smartphone,
  Palette,
  HelpCircle,
  FileCheck,
  ChevronRight,
} from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  showChevron?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onClick,
  trailing,
  showChevron = true,
}: SettingsItemProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 px-6 py-3.5 transition-all duration-200 hover:bg-secondary/30"
  >
    <div className="text-muted-foreground">{icon}</div>
    <div className="flex-1 text-left">
      <span className="text-[15px] text-foreground">{title}</span>
    </div>
    {trailing}
    {!trailing && showChevron && (
      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
    )}
  </button>
);

export const SettingsDialog = ({
  children,
  user: _user,
}: {
  children: ReactNode;
  user?: UserType;
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const sections: Array<{
    key: string;
    items: Array<{
      key: string;
      icon: React.ReactNode;
      title: string;
      onClick?: () => void;
      trailing?: React.ReactNode;
      showChevron?: boolean;
    }>;
  }> = [
    {
      key: "account",
      items: [
        {
          key: "my-account",
          icon: <User className="w-5 h-5" />,
          title: "My Account",
          onClick: () => console.log("My Account"),
        },
        {
          key: "notifications",
          icon: <Bell className="w-5 h-5" />,
          title: "Notifications and Sounds",
          onClick: () => console.log("Notifications"),
        },
        {
          key: "privacy",
          icon: <Lock className="w-5 h-5" />,
          title: "Privacy and Security",
          onClick: () => console.log("Privacy"),
        },
      ],
    },
    {
      key: "identity",
      items: [
        {
          key: "verification-status",
          icon: <ShieldCheck className="w-5 h-5" />,
          title: "Verification Status",
          onClick: () => console.log("Verification Status"),
        },
        {
          key: "upload-docs",
          icon: <FileText className="w-5 h-5" />,
          title: "Upload Documents",
          onClick: () => console.log("Upload Documents"),
        },
      ],
    },
    {
      key: "preferences",
      items: [
        {
          key: "email-alerts",
          icon: <Mail className="w-5 h-5" />,
          title: "Email Alerts",
          onClick: () => setEmailAlerts(!emailAlerts),
          trailing: (
            <Switch
              checked={emailAlerts}
              onCheckedChange={setEmailAlerts}
              onClick={(e) => e.stopPropagation()}
            />
          ),
          showChevron: false,
        },
        {
          key: "sms-alerts",
          icon: <Smartphone className="w-5 h-5" />,
          title: "SMS Alerts",
          onClick: () => setSmsAlerts(!smsAlerts),
          trailing: (
            <Switch
              checked={smsAlerts}
              onCheckedChange={setSmsAlerts}
              onClick={(e) => e.stopPropagation()}
            />
          ),
          showChevron: false,
        },
        {
          key: "theme",
          icon: <Palette className="w-5 h-5" />,
          title: "Theme",
          onClick: () => setDarkMode(!darkMode),
          trailing: (
            <span className="text-sm text-accent">
              {darkMode ? "Dark" : "Light"}
            </span>
          ),
          showChevron: false,
        },
      ],
    },
    {
      key: "help",
      items: [
        {
          key: "support",
          icon: <HelpCircle className="w-5 h-5" />,
          title: "Contact Support",
          onClick: () => console.log("Contact Support"),
        },
        {
          key: "terms",
          icon: <FileCheck className="w-5 h-5" />,
          title: "Terms & Conditions",
          onClick: () => console.log("Terms & Conditions"),
        },
      ],
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0 overflow-hidden bg-card border-border/50 shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-300">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Settings
          </DialogTitle>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 pt-2 pb-2">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-foreground">John Doe</div>
              <div className="text-sm text-muted-foreground">@johndoe</div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="bg-border/30" />

        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          {sections.map((section, idx) => (
            <div key={section.key} className="py-2">
              {section.items.map((it) => (
                <SettingsItem
                  key={it.key}
                  icon={it.icon}
                  title={it.title}
                  onClick={it.onClick}
                  trailing={it.trailing}
                  showChevron={it.showChevron}
                />
              ))}
              {idx < sections.length - 1 && (
                <Separator className="bg-border/30" />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
