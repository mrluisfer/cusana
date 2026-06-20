"use client";

import { Button } from "@/components/ui/button";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { CalendarDay } from "./CalendarDay";

async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  const data = await response.json();
  return data.subscriptions ?? [];
}

export function BillingCalendar() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const [monthOffset, setMonthOffset] = useState(0);

  const weekDays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(toIntlLocale(language), {
      weekday: "short",
    });
    // 2024-01-01 is a Monday — build a Monday-first week.
    return Array.from({ length: 7 }, (_, i) =>
      fmt.format(new Date(2024, 0, 1 + i)),
    );
  }, [language]);

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

  const monthName = viewDate.toLocaleDateString(toIntlLocale(language), {
    month: "long",
  });
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
    return date.toLocaleDateString(toIntlLocale(language), { weekday: "long" });
  };

  const currentDayOfWeekIndex = (now.getDay() + 6) % 7;

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          onClick={() => setMonthOffset((prev) => prev - 1)}
          aria-label={t("dashboard.calendar.prevMonth")}
          variant="outline"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <h2 className="group hover:text-primary text-lg font-semibold tracking-tight transition">
          <span className="capitalize">{monthName}</span>{" "}
          <span className="text-muted-foreground font-normal transition group-hover:text-white">
            {yearLabel}
          </span>
        </h2>
        <div className="flex items-center gap-1.5 select-none">
          <Button
            type="button"
            onClick={() => setMonthOffset(0)}
            size={"lg"}
            disabled={isCurrentMonth}
            variant={isCurrentMonth ? "secondary" : "default"}
          >
            {t("dashboard.calendar.today")}
          </Button>
          <Button
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            disabled={monthOffset >= 4}
            aria-label={t("dashboard.calendar.nextMonth")}
            variant="outline"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      {isPending ? (
        <CalendarSkeleton />
      ) : (
        <div
          className="space-y-1.5"
          role="grid"
          aria-label={t("dashboard.calendar.gridLabel")}
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="row">
            {weekDays.map((day, i) => (
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
