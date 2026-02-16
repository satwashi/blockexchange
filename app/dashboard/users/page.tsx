"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user";
import { Ban, Eye, Key, Mail, ShieldX, Trash, User } from "lucide-react";
import UsersSkeleton from "./_cmps/skeletons/users-skeleton";
import { useListUsers } from "@/queries/useUsers";
import GenericTable, { ActionItem } from "../_cmp/Generic-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { removeUser } from "@/server/user/remove-user";
import { unbanUser } from "@/server/user/unban-user";
import { banUser } from "@/server/user/ban-user";
import { updateUserPassword } from "@/server/user/update-password";
import { queryClient } from "@/providers/query-provider";
import { useImpersonation } from "@/providers/impersonate-provider";

// export type DropdownAction<T> = {
//   label: string;
//   icon?: React.ReactNode;
//   onClick?: (item: T) => void;
// };

export default function Page() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { users, isLoading, error, totalPages, total } = useListUsers({
    page,
    limit,
  });

  const { impersonateUser } = useImpersonation();

  if (isLoading) return <UsersSkeleton />;
  if (error) return <div className="mt-[100px]">Error loading users</div>;

  /** Helper to run an async action and invalidate "users" query */
  async function runAndInvalidate(action: () => Promise<any>) {
    try {
      await action();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      console.error(err);
    }
  }

  function getUserActions(user: UserType): ActionItem<UserType>[] {
    return [
      {
        label: user.banned ? "Unban" : "Ban",
        icon: user.banned ? (
          <ShieldX className="mr-2 h-4 w-4 text-green-600" />
        ) : (
          <Ban className="mr-2 h-4 w-4 text-red-600" />
        ),
        onClick: () =>
          runAndInvalidate(() =>
            user.banned ? unbanUser(user.id) : banUser(user.id)
          ),
      },
      {
        label: "Remove",
        icon: <Trash className="mr-2 h-4 w-4 text-red-500" />,
        onClick: () => runAndInvalidate(() => removeUser(user.id)),
      },
      {
        label: "Update Password",
        icon: <Key className="mr-2 h-4 w-4 text-yellow-500" />,
        onClick: () =>
          runAndInvalidate(() => updateUserPassword(user.id, "hellloooo")),
      },
      {
        label: "Impersonate",
        icon: <User className="mr-2 h-4 w-4 text-blue-500" />,
        onClick: () => runAndInvalidate(() => impersonateUser(user.id)), // usually no need to invalidate
      },
      {
        label: "View",
        icon: <Eye className="mr-2 h-4 w-4 text-muted-foreground" />,
        onClick: () => console.log(`Navigate to ${user.id}`),
      },
      {
        label: "Contact",
        icon: <Mail className="mr-2 h-4 w-4 text-blue-500" />,
        onClick: () => console.log(`Contacting ${user.name}`),
      },
    ];
  }

  return (
    <div className="w-full mt-[100px] px-8 mb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
      </div>

      <div className="w-full overflow-x-auto">
        <GenericTable
          data={users!}
          columns={userColumns}
          actions={getUserActions}
        />
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, total)} of {total} users
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const userColumns = [
  {
    key: "image",
    label: "Profile",
    render: (user: UserType) => (
      <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-full">
        <Avatar className="w-full h-full">
          <AvatarImage
            src={user.image!}
            alt={user.name}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  { key: "name", label: "Name" },
  {
    key: "role",
    label: "Role",
    render: (user: UserType) => (
      <span
        className={`capitalize font-medium ${
          user.role === "admin" ? "text-green-600" : "text-blue-600"
        }`}
      >
        {user.role}
      </span>
    ),
  },
  { key: "username", label: "Username" },
];
