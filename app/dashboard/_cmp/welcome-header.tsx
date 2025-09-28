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
            Here&apos;s what&apos;s happening with your properties today.
          </p>
        </div>

        {/* Right: Role + Actions */}
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-end">
          {/* User role badge */}
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-medium text-sm shadow-sm whitespace-nowrap">
            {user!.role!.toUpperCase()}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            Post a Home
          </Button>
          <Button variant="outline" size="sm">
            See Your Homes
          </Button>
        </div>
      </div>
    </>
  );
}
