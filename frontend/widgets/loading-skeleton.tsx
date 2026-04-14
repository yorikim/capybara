import { Skeleton } from "@/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-9 w-60" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
