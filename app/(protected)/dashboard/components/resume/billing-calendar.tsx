"use client";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { billingCycleLabels } from "@/constants/billing-cycle";
import { currencySymbols } from "@/constants/currency";
import { type ServiceKey } from "@/constants/icons";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  const data = await response.json();
  return data.subscriptions ?? [];
}

function CalendarSkeleton() {
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

function DayPopoverContent({
  day,
  payments,
  monthName,
  dayOfWeek,
}: {
  day: number;
  payments: Subscription[];
  monthName: string;
  dayOfWeek: string;
}) {
  const total = payments.reduce(
    (sum, p) => sum + (Number.parseFloat(String(p.price)) || 0),
    0,
  );

  return (
    <div className="w-full space-y-2.5 p-0.5">
      <p className="text-sm">
        <span className="font-semibold capitalize">
          {monthName} {day},
        </span>{" "}
        <span className="text-muted-foreground capitalize">{dayOfWeek}</span>
      </p>

      <div className="space-y-0.5">
        {payments.map((payment) => {
          const price = Number.parseFloat(String(payment.price)) || 0;
          const symbol = currencySymbols[payment.currency] ?? "$";
          const platform = payment.platform as ServiceKey;

          return (
            <div
              key={payment.id}
              className="flex items-center gap-3 rounded-lg p-1.5"
            >
              <ServiceIcon service={platform} size="xs" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">
                  {payment.name}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {billingCycleLabels[payment.billingCycle]}
                </p>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {symbol}
                {price.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          );
        })}
      </div>

      {payments.length > 1 && (
        <div className="border-border border-t border-dashed pt-2.5">
          <div className="flex items-center justify-between px-1.5">
            <span className="text-muted-foreground text-sm">Total:</span>
            <span className="font-mono text-sm font-bold tabular-nums">
              $
              {total.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

type CalendarDayProps = {
  day: number;
  isToday: boolean;
  isPast: boolean;
  payments: Subscription[];
  monthName: string;
  dayOfWeek: string;
};

function CalendarDay({
  day,
  isToday,
  isPast,
  payments,
  monthName,
  dayOfWeek,
}: CalendarDayProps) {
  const hasPayments = payments.length > 0;

  const dayElement = (
    <div
      role="gridcell"
      aria-label={`Día ${day}${isToday ? ", hoy" : ""}${hasPayments ? `, ${payments.length} cobro${payments.length > 1 ? "s" : ""}` : ""}`}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition-all select-none",
        isToday && "ring-primary text-primary font-bold ring-2",
        !isToday && hasPayments && "bg-muted/50 hover:bg-muted cursor-pointer",
        !isToday && !hasPayments && isPast && "text-muted-foreground/30",
        !isToday && !hasPayments && !isPast && "text-muted-foreground/60",
      )}
    >
      {hasPayments && !isToday ? (
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

export function BillingCalendar() {
  const { data: session } = useSession();
  const [monthOffset, setMonthOffset] = useState(0);

  const { data: subscriptions, isPending } = useQuery<Subscription[]>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: () => fetchSubscriptions(session!.user.id),
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  const now = useMemo(() => new Date(), []);
  const viewDate = useMemo(() => {
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  }, [now, monthOffset]);

  const isCurrentMonth = monthOffset === 0;
  const today = isCurrentMonth ? now.getDate() : -1;

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = (viewDate.getDay() + 6) % 7;

  const monthName = viewDate.toLocaleDateString("es-MX", { month: "long" });
  const yearLabel = viewDate.getFullYear();

  const billingDays = useMemo(() => {
    const map = new Map<number, Subscription[]>();
    const viewMonth = viewDate.getMonth();

    subscriptions?.forEach((sub) => {
      if (sub.billingCycle === "yearly") {
        const resolvedMonth = sub.billingMonth
          ? sub.billingMonth - 1
          : new Date(sub.createdAt).getMonth();
        if (resolvedMonth !== viewMonth) return;
      }

      const day = Math.min(sub.billingDay, daysInMonth);
      const existing = map.get(day) ?? [];
      map.set(day, [...existing, sub]);
    });
    return map;
  }, [subscriptions, daysInMonth, viewDate]);

  const getDayOfWeek = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date.toLocaleDateString("es-MX", { weekday: "long" });
  };

  const currentDayOfWeekIndex = (now.getDay() + 6) % 7;

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-xl transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <h2 className="text-lg font-semibold tracking-tight">
            <span className="capitalize">{monthName}</span>{" "}
            <span className="text-muted-foreground font-normal">
              {yearLabel}
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            disabled={monthOffset >= 2}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex size-8 items-center justify-center rounded-xl transition-colors disabled:pointer-events-none disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>

        {!isCurrentMonth && (
          <Button
            type="button"
            onClick={() => setMonthOffset(0)}
            variant={"secondary"}
            size={"lg"}
          >
            Hoy
          </Button>
        )}
      </div>

      {isPending ? (
        <CalendarSkeleton />
      ) : (
        <div
          className="space-y-1.5"
          role="grid"
          aria-label="Calendario de cobros"
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="row">
            {WEEK_DAYS.map((day, i) => (
              <div
                key={day}
                role="columnheader"
                className={cn(
                  "flex h-8 items-center justify-center text-xs font-medium",
                  isCurrentMonth && i === currentDayOfWeekIndex
                    ? "text-primary font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="row">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`e-${i}`} role="gridcell" className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const payments = billingDays.get(day) ?? [];
              const isToday = day === today;
              const isPast = isCurrentMonth && day < today;

              return (
                <CalendarDay
                  key={day}
                  day={day}
                  isToday={isToday}
                  isPast={isPast}
                  payments={payments}
                  monthName={monthName}
                  dayOfWeek={getDayOfWeek(day)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
