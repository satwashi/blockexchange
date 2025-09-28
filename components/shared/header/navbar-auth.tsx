import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/theme-togle";

import Link from "next/link";

export function NavbarAuth() {
  return (
    <div className="flex items-center space-x-4">
      {/* Log In button (hidden on small screens) */}
      <Button asChild variant="ghost" className="hidden md:flex text-sm">
        <Link href="/login">Log In</Link>
      </Button>

      <Button asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
      <ModeToggle />
    </div>
  );
}
