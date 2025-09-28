import { AppSidebar } from "@/app/dashboard/_cmp/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashBoardHeader from "./_cmp/dash-board-header";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // You can add session checks here if needed, e.g.:
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;

  // Redirect if not admin or banned
  if (!user || user.role !== "admin" || user.banned === true) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full">
          <DashBoardHeader />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
