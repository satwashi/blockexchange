import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ContactSupportSetting() {
  return (
    <Link href="/support" className="block">
      <Button variant="ghost" className="w-full justify-start px-6 py-2">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Contact Support</span>
        </div>
      </Button>
    </Link>
  );
}
