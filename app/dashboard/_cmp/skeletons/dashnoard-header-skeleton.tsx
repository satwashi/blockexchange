"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashBoardHeaderSkeleton() {
  return (
    <header className="h-16 z-30 bg-white border-b fixed right-0 left-0 border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left side: Sidebar trigger + title */}
      <div className="flex items-center gap-4">
        {/* SidebarTrigger skeleton */}
        <Skeleton className="h-6 w-6 rounded" />
        {/* Title skeleton */}
        <Skeleton className="h-6 w-36 rounded" />
      </div>

      {/* Right side: Bell, user info, logout */}
      <div className="flex items-center gap-4">
        {/* Bell button skeleton */}
        <Skeleton className="h-8 w-8 rounded-full" />

        {/* User info block */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            {/* User name */}
            <Skeleton className="h-4 w-24 rounded mb-1" />
            {/* User role */}
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          {/* Avatar skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Logout button skeleton */}
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
}
