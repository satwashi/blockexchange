import { Skeleton } from "@/components/ui/skeleton"; // assuming you have a Skeleton component like shadcn/ui

export function AppSidebarSkeleton({ num }: { num: number }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-4 flex flex-col h-full">
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex flex-col flex-1 space-y-2">
          <Skeleton className="w-32 h-6 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1">
        {[...Array(num)].map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-lg w-full" />
        ))}
      </nav>

      {/* Contact Support */}
      <div className="mt-auto pt-8">
        <div className="p-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 animate-pulse">
          <Skeleton className="w-24 h-5 rounded-md mb-1" />
          <Skeleton className="w-40 h-4 rounded-md mb-3" />
          <Skeleton className="w-20 h-6 rounded-md" />
        </div>
      </div>
    </aside>
  );
}
