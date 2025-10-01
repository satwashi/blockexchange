"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function KycStatusSettings({ user }: { user: UserType }) {
  const router = useRouter();

  const handleClick = () => {
    if (user.kyc_status === null) {
      router.push("/kyc");
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-between px-6 py-2 m-0"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium">KYC Status</span>
      </div>

      {user.kyc_status === "pending" && (
        <Badge variant="outline" className="text-sm text-muted-foreground">
          Pending
        </Badge>
      )}
      {user.kyc_status === "verified" && (
        <Badge variant="outline" className="text-sm text-green-500">
          Verified
        </Badge>
      )}
      {user.kyc_status === "rejected" && (
        <Badge variant="outline" className="text-sm text-red-500">
          Rejected
        </Badge>
      )}
      {user.kyc_status === null && (
        <Badge variant="outline" className="text-sm text-muted-foreground">
          Verify Now
        </Badge>
      )}
    </Button>
  );
}
