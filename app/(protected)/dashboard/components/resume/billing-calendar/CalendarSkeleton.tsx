import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-8 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton
            key={`d-${i}`}
            className="aspect-square w-full rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
