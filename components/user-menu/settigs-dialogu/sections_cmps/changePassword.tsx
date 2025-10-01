import { Lock, Pen } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save } from "lucide-react";
import { UserType } from "@/types/user";

type PasswordDialogProps = {
  user: UserType;
  children: ReactNode;
};

import { Button } from "@/components/ui/button";

export default function ChangePasswordSetting({ user }: { user: UserType }) {
  return (
    <ChangePasswordDialog user={user}>
      <Button variant="ghost" className="w-full justify-start px-6 py-2 m-0">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Change Password</span>
        </div>
      </Button>
    </ChangePasswordDialog>
  );
}

function ChangePasswordDialog({ user, children }: PasswordDialogProps) {
  // State for login password form
  const [newLoginPassword, setNewLoginPassword] = useState("");
  const [confirmLoginPassword, setConfirmLoginPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // State for withdrawal password
  const [withdrawalPassword, setWithdrawalPassword] = useState(
    user.withdrawal_password || ""
  );
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState(false);

  const handleSave = () => {
    console.log("New Login Password:", newLoginPassword);
    console.log("Confirm Login Password:", confirmLoginPassword);

    if (user.withdrawal_password !== undefined) {
      console.log("Updated Withdrawal Password:", withdrawalPassword);
    }

    setEditingWithdrawal(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Update Passwords
          </DialogTitle>
        </DialogHeader>

        {/* Login Password Section */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm text-gray-500">Set Login Password</span>

          <Input
            type={showLogin ? "text" : "password"}
            placeholder="New Password"
            value={newLoginPassword}
            onChange={(e) => setNewLoginPassword(e.target.value)}
          />

          <Input
            type={showLogin ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmLoginPassword}
            onChange={(e) => setConfirmLoginPassword(e.target.value)}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLogin(!showLogin)}
            className="self-end hover:bg-transparent"
          >
            {showLogin ? (
              <EyeOff className="w-5 h-5 text-gray-500" />
            ) : (
              <Eye className="w-5 h-5 text-gray-500" />
            )}
          </Button>
        </div>

        {/* Withdrawal Password Section (only if exists / KYC verified) */}
        {user.withdrawal_password !== undefined && (
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">Withdrawal Password</span>
            {editingWithdrawal ? (
              <Input
                type={showWithdrawal ? "text" : "password"}
                value={withdrawalPassword}
                onChange={(e) => setWithdrawalPassword(e.target.value)}
                placeholder="Enter Withdrawal Password"
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="tracking-widest text-lg">
                  {showWithdrawal ? withdrawalPassword : "••••••"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowWithdrawal(!showWithdrawal)}
                  className="hover:bg-transparent"
                >
                  {showWithdrawal ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingWithdrawal(true)}
                  className="hover:bg-transparent"
                >
                  <Pen className="w-5 h-5 text-green-500" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="rounded-xl px-6">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
