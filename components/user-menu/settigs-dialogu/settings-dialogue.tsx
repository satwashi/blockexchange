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

import { type ReactNode } from "react";
import type { UserType } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import UserInfo from "../user-info";
import { createSettingsSections } from "./sections";

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
    className="w-full flex items-center justify-between px-6 hover:bg-muted/50 transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
    <div className="flex items-center gap-2">
      {trailing}
      {!trailing && showChevron && (
        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
      )}
    </div>
  </button>
);

type DialogListItem =
  | {
      type?: "item";
      icon: React.ReactNode;
      title: string;
      onClick?: () => void;
      trailing?: React.ReactNode;
      showChevron?: boolean;
    }
  | {
      type: "component";
      component?: ReactNode;
      render?: (user?: UserType) => ReactNode;
    };

export const SettingsDialog = ({
  children,
  user: _user,
  extraTopItems,
}: {
  children: ReactNode;
  user?: UserType;
  extraTopItems?: DialogListItem[];
}) => {
  const sections = createSettingsSections();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] p-0 pb-4 overflow-y-scroll bg-card border-border/50 shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-8 duration-300">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Settings
          </DialogTitle>
          {/* User Profile Section */}
          <UserInfo user={_user} />
        </DialogHeader>

        <Separator className="bg-border/30" />

        <div
          className="overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(156, 163, 175, 0.3) transparent",
          }}
        >
          {/* Optional consumer-provided items at the very top */}
          {extraTopItems && extraTopItems.length > 0 && (
            <div>
              {extraTopItems.map((it, idx) => {
                if ((it as any).type === "component") {
                  const comp = it as Extract<
                    DialogListItem,
                    { type: "component" }
                  >;
                  const node = comp.render
                    ? comp.render(_user)
                    : comp.component;
                  return <div key={`extra-${idx}`}>{node}</div>;
                }
                const row = it as Extract<DialogListItem, { type?: "item" }>;
                return (
                  <SettingsItem
                    key={`extra-${idx}`}
                    icon={(row as any).icon}
                    title={(row as any).title}
                    onClick={row.onClick}
                    trailing={row.trailing}
                    showChevron={row.showChevron}
                  />
                );
              })}
              <Separator className="bg-border/30" />
            </div>
          )}
          {sections.map((section, idx) => (
            <div
              key={section.key}
              className={idx < sections.length - 1 ? "mb-4" : ""}
            >
              {/* Section Header */}
              <div className="px-6 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {section.key === "account" && "Account"}
                  {section.key === "identity" && "Identity & Verification"}
                  {section.key === "preferences" && "Preferences"}
                  {section.key === "help" && "Help & Support"}
                </h3>
              </div>
              {section.items.map((it) => {
                if ((it as any).type === "component") {
                  const comp = it as Extract<
                    DialogListItem,
                    { type: "component" }
                  > & { key: string };
                  const node = comp.render
                    ? comp.render(_user)
                    : comp.component;
                  return <div key={comp.key}>{node}</div>;
                }
                const row = it as Extract<DialogListItem, { type?: "item" }> & {
                  key: string;
                };
                return (
                  <SettingsItem
                    key={(row as any).key}
                    icon={(row as any).icon}
                    title={(row as any).title}
                    onClick={row.onClick}
                    trailing={row.trailing}
                    showChevron={row.showChevron}
                  />
                );
              })}
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
