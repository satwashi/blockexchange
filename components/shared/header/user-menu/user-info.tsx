import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/types/user";

const getKycStatusLabel = (status?: string) => {
  switch (status) {
    case "verified":
      return "Verified";
    case "pending":
      return "Pending";
    case "rejected":
      return "Rejected";
    default:
      return "Unverified";
  }
};

const UserInfo = ({ user }: { user: UserType }) => {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const payId = user.id.slice(0, 5).toUpperCase();

  const kycColors: Record<string, string> = {
    verified: "bg-green-100 text-green-700 border border-green-300",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    rejected: "bg-red-100 text-red-700 border border-red-300",
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-2xl border shadow-sm bg-card">
      {/* Avatar */}
      <Avatar className="h-12 w-12 ring-2 ring-primary/30 shadow-sm">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{user.name}</p>
          {user.kyc_status && (
            <Badge
              className={`text-xs px-2 py-0 rounded-md ${
                kycColors[user.kyc_status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {getKycStatusLabel(user.kyc_status)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{user.email}</p>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Pay ID */}
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
            Pay ID: {payId}
          </Badge>

          {/* Role */}
          {user.role && (
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              {user.role}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
