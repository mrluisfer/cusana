import { Skeleton } from "@/components/ui/skeleton";
import { placeholderKeys } from "@/utils/placeholder-keys";

const WEEKDAY_KEYS = placeholderKeys("weekday", 7);
const DAY_KEYS = placeholderKeys("day", 35);

export function CalendarSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_KEYS.map((key) => (
          <Skeleton key={key} className="h-8 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAY_KEYS.map((key) => (
          <Skeleton key={key} className="aspect-square w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
