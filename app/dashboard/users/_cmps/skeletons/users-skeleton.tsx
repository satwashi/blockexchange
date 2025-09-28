import { TableSkeleton } from "@/app/dashboard/_cmp/skeletons/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersSkeleton() {
  return (
    <div className="w-full mt-[100px] px-8 space-y-6">
      {/* Heading skeleton */}
      <Skeleton className="h-8 w-48 rounded-md" />

      {/* Table container skeleton wrapper */}
      <Skeleton className="w-full h-[400px] rounded-lg" />

      {/* Actual table skeleton inside the container */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-200 absolute top-[110px] left-8 right-8 pointer-events-none opacity-0">
        {/* This div is hidden, just placeholder for alignment */}
        <TableSkeleton columnsCount={6} />
      </div>
    </div>
  );
}
