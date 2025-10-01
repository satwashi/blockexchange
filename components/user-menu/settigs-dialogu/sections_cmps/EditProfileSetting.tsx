import { User, Save, Loader2 } from "lucide-react";
import { ReactNode } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { UserType } from "@/types/user";
import { useUpdateUser } from "@/queries/user/useUpdateUser";
export default function EditProfileSetting({ user }: { user: UserType }) {
  return (
    <UserDialog user={user}>
      <Button variant="ghost" className="w-full justify-start px-6 py-2 m-0">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Edit Profile</span>
        </div>
      </Button>
    </UserDialog>
  );
}

type UserDialogProps = {
  user: UserType;
  children: ReactNode;
};

function UserDialog({ user, children }: UserDialogProps) {
  const { updateName, isUpdating } = useUpdateUser();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [hasChanges, setHasChanges] = useState(false);

  const shortId = user.id.slice(0, 5); // Pay ID: first 5 letters of ID

  const handleSave = async () => {
    if (!hasChanges) {
      setEditing(false);
      return;
    }

    try {
      await updateName(name); // Now updating the actual name field
      setEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    setHasChanges(newName !== user.name);
  };

  const handleCancel = () => {
    setName(user.name);
    setEditing(false);
    setHasChanges(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={64}
              height={64}
              className="rounded-full border shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {/* Editable Name */}
            <div className="relative group">
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-48 border border-gray-300"
                    placeholder="Enter name"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isUpdating || !hasChanges}
                      className="h-8 px-2"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="h-8 px-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setEditing(true)}
                >
                  <span className="text-lg font-medium">{name}</span>
                  <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            <span className="text-sm text-gray-500">Pay ID: {shortId}</span>
            {user.role && (
              <span className="text-sm text-gray-600">Role: {user.role}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
