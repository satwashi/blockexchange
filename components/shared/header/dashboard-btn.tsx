import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function DashboardBtn() {
  return (
    <div className="hidden md:flex space-x-3">
      <Link href="/dashboard" aria-label="Dashboard">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          title="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Button>
      </Link>
    </div>
  );
}
