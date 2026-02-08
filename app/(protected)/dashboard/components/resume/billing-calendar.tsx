"use client";

import { CardHeaderIcon } from "@/components/card-header-icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

const WEEK_DAYS = ["D", "L", "M", "Mi", "J", "V", "S"] as const;
const WEEK_DAYS_FULL = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

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
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`day-${i}`} className="h-9 w-full" />
        ))}
      </div>
    </div>
  );
}

function DayTooltipContent({
  day,
  payments,
  isToday,
}: {
  day: number;
  payments: Subscription[];
  isToday: boolean;
}) {
  return (
    <div className="max-w-56 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">
          Día {day}
          {isToday && (
            <span className="text-primary ml-1.5 text-[10px] font-normal">
              (hoy)
            </span>
          )}
        </p>
        <Badge variant="destructive" className="h-4 px-1 text-[10px]">
          {payments.length} cobro{payments.length > 1 ? "s" : ""}
        </Badge>
      </div>
      <Separator />
      <ul className="space-y-1.5">
        {payments.map((payment) => {
          const price = Number.parseFloat(String(payment.price)) || 0;
          const symbol = currencySymbols[payment.currency] ?? "$";

          return (
            <li key={payment.id} className="flex items-center gap-2">
              <span className="flex-1 truncate text-xs">{payment.name}</span>
              <span className="font-mono text-xs font-medium tabular-nums">
                {symbol}
                {price.toLocaleString("es-MX", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type CalendarDayProps = {
  day: number;
  isToday: boolean;
  isPast: boolean;
  payments: Subscription[];
};

function CalendarDay({ day, isToday, isPast, payments }: CalendarDayProps) {
  const hasPayments = payments.length > 0;

  const dayElement = (
    <div
      role="gridcell"
      aria-label={`Día ${day}${isToday ? ", hoy" : ""}${hasPayments ? `, ${payments.length} cobro${payments.length > 1 ? "s" : ""}` : ""}`}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "relative flex h-9 items-center justify-center text-xs tabular-nums transition-colors select-none",
        isToday && "bg-primary text-primary-foreground font-bold",
        !isToday &&
          hasPayments &&
          "bg-destructive/10 text-destructive cursor-pointer font-medium",
        !isToday && !hasPayments && isPast && "text-muted-foreground/40",
        !isToday && !hasPayments && !isPast && "text-foreground",
        hasPayments && !isToday && "hover:bg-destructive/15",
      )}
    >
      {day}
      {hasPayments && (
        <span
          className={cn(
            "absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center text-[8px] font-bold",
            isToday
              ? "bg-primary-foreground text-primary"
              : "bg-destructive text-destructive-foreground",
          )}
          aria-hidden="true"
        >
          {payments.length}
        </span>
      )}
    </div>
  );

  if (!hasPayments) return dayElement;

  return (
    <Tooltip>
      <TooltipTrigger className="outline-none">{dayElement}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        <DayTooltipContent day={day} payments={payments} isToday={isToday} />
      </TooltipContent>
    </Tooltip>
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
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    return d;
  }, [now, monthOffset]);

  const isCurrentMonth = monthOffset === 0;
  const today = isCurrentMonth ? now.getDate() : -1;

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = viewDate.getDay();

  const monthLabel = viewDate.toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });

  const billingDays = useMemo(() => {
    const map = new Map<number, Subscription[]>();
    subscriptions?.forEach((sub) => {
      const day = Math.min(sub.billingDay, daysInMonth);
      const existing = map.get(day) ?? [];
      map.set(day, [...existing, sub]);
    });
    return map;
  }, [subscriptions, daysInMonth]);

  const totalPaymentsThisMonth = useMemo(() => {
    let total = 0;
    for (const payments of billingDays.values()) {
      total += payments.length;
    }
    return total;
  }, [billingDays]);

  const nextPaymentDay = useMemo(() => {
    if (!isCurrentMonth) return null;
    const todayDate = now.getDate();
    let closest: number | null = null;

    for (const day of billingDays.keys()) {
      if (day > todayDate) {
        if (closest === null || day < closest) {
          closest = day;
        }
      }
    }
    return closest;
  }, [billingDays, isCurrentMonth, now]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={CalendarDaysIcon} />
          Calendario de Cobros
        </CardTitle>
        <CardDescription>
          {isPending ? (
            <Skeleton className="h-3 w-32" />
          ) : nextPaymentDay && isCurrentMonth ? (
            <span className="flex items-center gap-1">
              <CircleAlertIcon className="text-destructive h-3 w-3" />
              Próximo cobro el día {nextPaymentDay}
            </span>
          ) : (
            "Visualiza tus cobros programados"
          )}
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="text-xs tabular-nums">
            {totalPaymentsThisMonth} cobro
            {totalPaymentsThisMonth !== 1 ? "s" : ""}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Navegación de mes */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev - 1)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-7 w-7 items-center justify-center transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium capitalize">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonthOffset((prev) => prev + 1)}
            disabled={monthOffset >= 2}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-7 w-7 items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {isPending ? (
          <CalendarSkeleton />
        ) : (
          <TooltipProvider delay={150}>
            <div
              className="space-y-1"
              role="grid"
              aria-label="Calendario de cobros"
            >
              {/* Header de días */}
              <div className="grid grid-cols-7 gap-1" role="row">
                {WEEK_DAYS.map((day, i) => (
                  <div
                    key={day}
                    role="columnheader"
                    aria-label={WEEK_DAYS_FULL[i]}
                    className="text-muted-foreground flex h-7 items-center justify-center text-[11px] font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grilla de días */}
              <div className="grid grid-cols-7 gap-1" role="row">
                {/* Celdas vacías */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} role="gridcell" className="h-9" />
                ))}

                {/* Días del mes */}
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
                    />
                  );
                })}
              </div>
            </div>
          </TooltipProvider>
        )}

        {/* Leyenda */}
        <Separator />
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs"
          aria-label="Leyenda del calendario"
        >
          <div className="flex items-center gap-1.5">
            <span
              className="bg-primary inline-block h-2.5 w-2.5"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">Hoy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="bg-destructive/20 inline-block h-2.5 w-2.5"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">Cobro programado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="bg-muted inline-block h-2.5 w-2.5"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">Día pasado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
