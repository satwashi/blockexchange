import { NavbarAuth } from "./navbar-auth";
import Logo from "./logo";
import DesktopNav from "./desktop-nav";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

import DashboardBtn from "./dashboard-btn";

import UserDropDown from "./user-drop-down";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const rolesWithAccess = ["superadmin", "admin"];

  const hasDashboardAccess = rolesWithAccess.includes(user?.role ?? "user");

  return (
    <header className="border-b border-crypto-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <DesktopNav />
          {!session && <NavbarAuth />}
          {hasDashboardAccess && <DashboardBtn />}
          {user && (
            <UserDropDown
              email={user.email}
              id={user.id}
              image={user.image}
              name={user.name}
              username={user.username}
              hasDashboardAccess={hasDashboardAccess}
            />
          )}
        </div>
      </div>
    </header>
  );
}
