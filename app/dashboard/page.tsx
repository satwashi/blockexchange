"use client";
import { useSession } from "@/queries/useSession";
import WelcomeHeader from "./_cmp/welcome-header";

const DashboardOverview = () => {
  const { user, isLoading } = useSession();

  // if (user?.role !== "admin") {
  //   router.push("/"); // redirect non-admins
  // }

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null; // prevent rendering until session loads

  return <WelcomeHeader />;
};

export default DashboardOverview;
