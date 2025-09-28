import { Skeleton } from "@/components/ui/skeleton";

export function ListOfTabsSkeleton() {
  return (
    <div className="grid w-full grid-cols-4 mb-6 bg-muted py-2 h-15 gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}
