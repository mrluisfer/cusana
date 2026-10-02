import { useAtomValue } from "jotai";
import { CircleCheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaymentRecord } from "@/app/api/[userid]/payments/route";
import { calendarHoverPreviewAtom } from "@/atoms";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { STATUS_CLASSES } from "@/constants/chart-colors";
import type { ServiceKey } from "@/constants/icons";
import type { PaymentState } from "@/hooks/use-subscription-payments";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { DayPopoverContent } from "./DayPopoverContent";

/** Un cobro de una suscripción en un día concreto del calendario. */
export type DayPayment = {
  subscription: Subscription;
  /** Fecha del cobro (YYYY-MM-DD). */
  dueDate: string;
  state: PaymentState;
  record: PaymentRecord | undefined;
};

export type CalendarDayProps = {
  day: number;
  isToday: boolean;
  isPast: boolean;
  payments: DayPayment[];
  monthName: string;
  dayOfWeek: string;
  /** El calendario controla qué día está abierto para que nunca haya dos popovers a la vez. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CalendarDay({
  day,
  isToday,
  isPast,
  payments,
  monthName,
  dayOfWeek,
  open,
  onOpenChange,
}: CalendarDayProps) {
  const { t } = useTranslation();
  const hoverPreview = useAtomValue(calendarHoverPreviewAtom);
  const hasPayments = payments.length > 0;

  const tracked = payments.filter((p) => p.state !== "untracked");
  const allPaid =
    tracked.length > 0 && tracked.every((p) => p.state === "paid");
  const hasOverdue = tracked.some((p) => p.state === "overdue");

  const dayElement = (
    <div
      role="gridcell"
      aria-label={`${day}${isToday ? `, ${t("dashboard.calendar.today")}` : ""}${hasPayments ? `, ${t("dashboard.calendar.charges", { count: payments.length })}` : ""}${allPaid ? `, ${t("dashboard.payments.allPaid")}` : ""}`}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all select-none",
        isToday && "font-bold text-primary ring-2 ring-primary",
        hasPayments && "cursor-pointer bg-muted/50 hover:bg-muted",
        !isToday && !hasPayments && isPast && "text-muted-foreground/30",
        !isToday && !hasPayments && !isPast && "text-muted-foreground/60",
      )}
    >
      {hasPayments ? (
        <>
          {allPaid && (
            <CircleCheckIcon
              aria-hidden="true"
              className={cn(
                "absolute top-1.5 right-1.5 size-3",
                STATUS_CLASSES.ok.text,
              )}
            />
          )}
          {hasOverdue && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-2 right-2 size-1.5 rounded-full",
                STATUS_CLASSES.warning.bar,
              )}
            />
          )}
          <div className="flex items-center justify-center gap-0.5">
            {payments.slice(0, 2).map((payment) => (
              <ServiceIcon
                key={payment.subscription.id}
                service={payment.subscription.platform as ServiceKey}
                size="2xs"
              />
            ))}
            {payments.length > 2 && (
              <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                +{payments.length - 2}
              </span>
            )}
          </div>
          <span className="mt-0.5 text-[10px] text-foreground/70 tabular-nums">
            {day}
          </span>
          {payments.some((p) => p.subscription.billingCycle === "monthly") && (
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
    <Popover open={open} onOpenChange={onOpenChange}>
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
