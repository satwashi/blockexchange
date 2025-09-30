import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme/theme-togle";

import Link from "next/link";

export function NavbarAuth() {
  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="outline"
        className="h-9 px-3 text-sm rounded-full"
        aria-label="Log in"
      >
        <Link href="/login">Log in</Link>
      </Button>

      <Button
        asChild
        className="h-9 px-3 text-sm rounded-full"
        aria-label="Sign up"
      >
        <Link href="/signup">Sign up</Link>
      </Button>

      <ModeToggle />
    </div>
  );
}
