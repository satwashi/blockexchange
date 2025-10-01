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
import { Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { UserType } from "@/types/user";
import { Button } from "@/components/ui/button";
import { useUpdateUser } from "@/queries/user/useUpdateUser";
import { toast } from "sonner";

type PasswordDialogProps = {
  user: UserType;
  children: ReactNode;
};

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
  const { updatePassword, updateWithdrawalPassword, isUpdating } =
    useUpdateUser();

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

  const handleSave = async () => {
    try {
      // Validate login password
      if (newLoginPassword && confirmLoginPassword) {
        if (newLoginPassword !== confirmLoginPassword) {
          toast.error("Passwords don't match");
          return;
        }
        if (newLoginPassword.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }
        await updatePassword(newLoginPassword);
        // Clear login password fields
        setNewLoginPassword("");
        setConfirmLoginPassword("");
      }

      // Update withdrawal password if changed
      if (
        user.withdrawal_password !== undefined &&
        withdrawalPassword !== user.withdrawal_password
      ) {
        await updateWithdrawalPassword(withdrawalPassword);
        setEditingWithdrawal(false);
      }
    } catch (error) {
      console.error("Failed to update passwords:", error);
    }
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
          <Button
            onClick={handleSave}
            className="rounded-xl px-6"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
