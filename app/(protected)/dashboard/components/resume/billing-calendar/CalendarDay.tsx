import { DayPopoverContent } from "./DayPopoverContent";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { type ServiceKey } from "@/constants/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Subscription } from "@/lib/schema";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

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
  const hasPayments = payments.length > 0;

  const dayElement = (
    <div
      role="gridcell"
      aria-label={`${day}${isToday ? `, ${t("dashboard.calendar.today")}` : ""}${hasPayments ? `, ${t("dashboard.calendar.charges", { count: payments.length })}` : ""}`}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all select-none",
        isToday && "ring-primary text-primary font-bold ring-2",
        hasPayments && "bg-muted/50 hover:bg-muted cursor-pointer",
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
              <span className="text-muted-foreground text-[10px] font-medium tabular-nums">
                +{payments.length - 2}
              </span>
            )}
          </div>
          <span className="text-foreground/70 mt-0.5 text-[10px] tabular-nums">
            {day}
          </span>
          {payments.some((p) => p.billingCycle === "monthly") && (
            <span className="bg-foreground/40 absolute bottom-1.5 size-1 rounded-full" />
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
      <PopoverTrigger className="outline-none">{dayElement}</PopoverTrigger>
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
