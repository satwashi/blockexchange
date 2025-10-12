"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/queries/useSession";

export default function WelcomeHeader() {
  const {
    user,
    isLoading,
    //loading state
  } = useSession();

  if (isLoading) return <>Loading</>;
  console.log(user);
  return (
    <>
      <div className="my-20 px-8 flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        {/* Left: Welcome */}
        <div>
          <h1 className="text-4xl font-bold  flex items-center gap-2">
            Welcome back, {user!.name || "Sarah Landlord"}!{" "}
            <span className="text-3xl">👋</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your platform today.
          </p>
        </div>
      </div>
    </>
  );
}
