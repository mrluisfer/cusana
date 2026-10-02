"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { QueryKeys } from "@/constants/query-keys";
import {
  getPaymentState,
  paymentKey,
  usePayments,
} from "@/hooks/use-subscription-payments";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import {
  getBillingDateInMonth,
  toISODate,
} from "@/utils/get-next-billing-date";
import { placeholderKeys } from "@/utils/placeholder-keys";
import { CalendarDay, type DayPayment } from "./CalendarDay";
import { CalendarSkeleton } from "./CalendarSkeleton";

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
  // Solo un popover abierto a la vez: con "abrir al pasar el cursor", un día
  // fijado con clic no debe quedarse abierto al pasar sobre otro.
  const [openDay, setOpenDay] = useState<number | null>(null);

  const changeMonth = (offset: number) => {
    setMonthOffset(offset);
    setOpenDay(null);
  };

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

  const [now] = useState(() => new Date());
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

  const todayISO = toISODate(now);
  const { data: paymentRecords } = usePayments(
    toISODate(viewDate),
    toISODate(
      new Date(viewDate.getFullYear(), viewDate.getMonth(), daysInMonth),
    ),
  );

  const billingDays = useMemo(() => {
    const map = new Map<number, DayPayment[]>();

    subscriptions?.forEach((sub) => {
      const date = getBillingDateInMonth(
        sub,
        viewDate.getFullYear(),
        viewDate.getMonth(),
      );
      if (!date) return;

      const dueDate = toISODate(date);
      const record = paymentRecords?.get(paymentKey(sub.id, dueDate));
      const payment: DayPayment = {
        subscription: sub,
        dueDate,
        record,
        state: getPaymentState({
          record,
          dueDate,
          today: todayISO,
          createdAt: sub.createdAt,
        }),
      };

      const day = date.getDate();
      map.set(day, [...(map.get(day) ?? []), payment]);
    });
    return map;
  }, [subscriptions, viewDate, paymentRecords, todayISO]);

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
          onClick={() => changeMonth(monthOffset - 1)}
          aria-label={t("dashboard.calendar.prevMonth")}
          variant="outline"
          size="icon"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <h2 className="text-lg font-semibold tracking-tight">
          <span className="capitalize transition hover:text-primary">
            {monthName}
          </span>{" "}
          <span className="font-normal text-muted-foreground">{yearLabel}</span>
        </h2>
        <div className="flex items-center gap-1.5 select-none">
          <Button
            type="button"
            onClick={() => changeMonth(0)}
            size={"lg"}
            disabled={isCurrentMonth}
            variant={isCurrentMonth ? "secondary" : "default"}
          >
            {t("dashboard.calendar.today")}
          </Button>
          <Button
            type="button"
            onClick={() => changeMonth(monthOffset + 1)}
            disabled={monthOffset >= 4}
            aria-label={t("dashboard.calendar.nextMonth")}
            variant="outline"
            size="icon"
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
                    ? "font-semibold text-primary"
                    : "text-muted-foreground",
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" role="row">
            {placeholderKeys("blank", firstDayOfMonth).map((key) => (
              <div key={key} aria-hidden="true" className="aspect-square" />
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
                  open={openDay === day}
                  onOpenChange={(open) =>
                    setOpenDay((current) =>
                      open ? day : current === day ? null : current,
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
