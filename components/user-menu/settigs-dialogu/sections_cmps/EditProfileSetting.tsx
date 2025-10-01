"use client";

import { User, Save, Loader2, Pencil, X, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { UserType } from "@/types/user";
import { useUpdateUser } from "@/queries/user/useUpdateUser";

export default function EditProfileSetting({ user }: { user: UserType }) {
  return (
    <UserDialog user={user}>
      <Button
        variant="ghost"
        className="w-full justify-between px-6 py-2 m-0 rounded-lg"
      >
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

  const shortId = user.id.slice(0, 5);

  const handleSave = async () => {
    if (!hasChanges) {
      setEditing(false);
      return;
    }

    try {
      await updateName(name);
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

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
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

          <div className="flex flex-col space-y-2 w-full">
            {/* Editable Name */}
            <div className="relative group w-full">
              {editing ? (
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                  <Input
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full sm:w-48 border border-gray-300"
                    placeholder="Enter name"
                  />
                  <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isUpdating || !hasChanges}
                      className="h-8 px-3 flex items-center justify-center"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating}
                      className="h-8 px-3 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => setEditing(true)}
                >
                  <span className="text-lg font-medium truncate">{name}</span>
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
