import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditProfileSetting() {
  return (
    <Link href="/dashboard/settings" className="block">
      <Button variant="ghost" className="w-full justify-start px-6 py-2 m-0">
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Edit Profile</span>
        </div>
      </Button>
    </Link>
  );
}
