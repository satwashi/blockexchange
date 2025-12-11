import { Navbar as NavbarAuth } from "./navbar-auth";
import Logo from "./logo";
import DesktopNav from "./desktop-nav";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

import DashboardBtn from "./dashboard-btn";
import { UserMenu } from "../../user-menu/UserMenu";
import { KycStatus } from "@/types/kyc/kyc";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const rolesWithAccess = ["superadmin", "admin"];

  const hasDashboardAccess = rolesWithAccess.includes(user?.role ?? "user");

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Backdrop blur layer */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/40" />
      
      <div className="container relative mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <DesktopNav />
          <div className="flex items-center gap-3">
            {hasDashboardAccess && <DashboardBtn />}
            {!session && <NavbarAuth />}
            {user && (
              <UserMenu
                user={{
                  ...user,
                  kyc_status: ((s: any) =>
                    s === "verified" || s === "pending" || s === "rejected"
                      ? (s as KycStatus)
                      : null)(user.kyc_status),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
