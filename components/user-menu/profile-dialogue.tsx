"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Shield,
  Calendar,
  AlertTriangle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useSession } from "@/queries/useSession";
import type { ReactNode } from "react";
import type { UserType } from "@/types/user";

export function ProfileDialog({
  children,
  user: passedUser,
}: {
  children: ReactNode;
  user?: UserType;
}) {
  const { user: sessionUser, isLoading, error } = useSession();
  const user = passedUser ?? sessionUser;
  if (!user) {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  }
  // Normalize field names between session user (camelCase) and UserType (snake_case)
  // const emailVerified =
  //   (user as any).emailVerified ?? (user as any).email_verified;
  const banReason = (user as any).banReason ?? (user as any).ban_reason;
  const banExpires = (user as any).banExpires ?? (user as any).ban_expires;
  const createdAt = (user as any).createdAt ?? (user as any).created_at;
  const updatedAt = (user as any).updatedAt ?? (user as any).updated_at;
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getKycBadgeVariant = (status?: string | null) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the user account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar and Name Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              {user.username && (
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {user.role && (
                  <Badge variant="secondary" className="capitalize">
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role}
                  </Badge>
                )}
                {user.kyc_status && (
                  <Badge
                    variant={getKycBadgeVariant(user.kyc_status)}
                    className="capitalize"
                  >
                    KYC: {user.kyc_status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Ban Alert */}
          {user.banned && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Account Banned</strong>
                {banReason && <p className="mt-1">Reason: {banReason}</p>}
                {banExpires && (
                  <p className="mt-1 text-xs">
                    Expires: {formatDate(banExpires)}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Contact Information
            </h4>
            <div className="space-y-2">
              {user.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              {user.telegram_id && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Telegram ID</p>
                    <p className="text-sm text-muted-foreground">
                      {user.telegram_id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Account Dates */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Account Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Created</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(updatedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-medium">User ID</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {user.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
