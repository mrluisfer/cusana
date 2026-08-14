import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { calendarHoverPreviewAtom } from "@/atoms";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ServiceKey } from "@/constants/icons";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { DayPopoverContent } from "./DayPopoverContent";

export type CalendarDayProps = {
  day: number;
  isToday: boolean;
  isPast: boolean;
  payments: Subscription[];
  monthName: string;
  dayOfWeek: string;
};

export function CalendarDay({
  day,
  isToday,
  isPast,
  payments,
  monthName,
  dayOfWeek,
}: CalendarDayProps) {
  const { t } = useTranslation();
  const hoverPreview = useAtomValue(calendarHoverPreviewAtom);
  const hasPayments = payments.length > 0;

  const dayElement = (
    <div
      role="gridcell"
      aria-label={`${day}${isToday ? `, ${t("dashboard.calendar.today")}` : ""}${hasPayments ? `, ${t("dashboard.calendar.charges", { count: payments.length })}` : ""}`}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "relative flex aspect-square select-none flex-col items-center justify-center rounded-2xl text-sm transition-all",
        isToday && "font-bold text-primary ring-2 ring-primary",
        hasPayments && "cursor-pointer bg-muted/50 hover:bg-muted",
        !isToday && !hasPayments && isPast && "text-muted-foreground/30",
        !isToday && !hasPayments && !isPast && "text-muted-foreground/60",
      )}
    >
      {hasPayments ? (
        <>
          <div className="flex items-center justify-center gap-0.5">
            {payments.slice(0, 2).map((payment) => (
              <ServiceIcon
                key={payment.id}
                service={payment.platform as ServiceKey}
                size="2xs"
              />
            ))}
            {payments.length > 2 && (
              <span className="font-medium text-[10px] text-muted-foreground tabular-nums">
                +{payments.length - 2}
              </span>
            )}
          </div>
          <span className="mt-0.5 text-[10px] text-foreground/70 tabular-nums">
            {day}
          </span>
          {payments.some((p) => p.billingCycle === "monthly") && (
            <span className="absolute bottom-1.5 size-1 rounded-full bg-foreground/40" />
          )}
        </>
      ) : (
        <span className="tabular-nums">{day}</span>
      )}
    </div>
  );

  if (!hasPayments) return dayElement;

  return (
    <Popover>
      <PopoverTrigger
        className="outline-none"
        openOnHover={hoverPreview}
        delay={150}
        closeDelay={100}
      >
        {dayElement}
      </PopoverTrigger>
      <PopoverContent side="bottom" sideOffset={6} className="w-72">
        <DayPopoverContent
          day={day}
          payments={payments}
          monthName={monthName}
          dayOfWeek={dayOfWeek}
        />
      </PopoverContent>
    </Popover>
  );
}
