import { User } from "lucide-react";
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
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const shortId = user.id.slice(0, 5); // Pay ID: first 5 letters of ID

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
            <div
              className="relative group"
              onMouseEnter={() => setEditing(true)}
              onMouseLeave={() => setEditing(false)}
            >
              {editing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-48 border border-gray-300"
                  />
                  <Pencil className="w-4 h-4 text-gray-500" />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-lg font-medium">{name}</span>
                  <Pencil className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
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
