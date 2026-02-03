"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CalendarDaysIcon } from "lucide-react";

function CalendarSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: 35 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

export function BillingCalendar() {
  const { data: session } = useSession();

  const { data: subscriptions, isPending } = useQuery<Subscription[]>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: async () => {
      const response = await fetch(`/api/${session!.user.id}/subscription`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      const data = await response.json();
      return data.subscriptions ?? [];
    },
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  // Crear mapa de días con cobros
  const billingDays = new Map<number, Subscription[]>();
  subscriptions?.forEach((sub) => {
    const existing = billingDays.get(sub.billingDay) ?? [];
    billingDays.set(sub.billingDay, [...existing, sub]);
  });

  const today = new Date().getDate();
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  // Obtener el día de la semana del primer día del mes
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  ).getDay();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4" />
              Calendario de Cobros
            </CardTitle>
            <CardDescription className="mt-1">
              {new Date().toLocaleDateString("es-MX", {
                month: "long",
                year: "numeric",
              })}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {billingDays.size} días con cobros
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ?
          <CalendarSkeleton />
        : <div className="space-y-2">
            {/* Encabezado de días */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espacios vacíos antes del primer día */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const hasPayments = billingDays.has(day);
                const payments = billingDays.get(day) ?? [];
                const isToday = day === today;
                const isPast = day < today;

                return (
                  <div
                    key={day}
                    className={cn(
                      "relative flex h-8 items-center justify-center text-xs transition-colors",
                      isToday && "bg-primary text-primary-foreground font-bold",
                      !isToday &&
                        hasPayments &&
                        "bg-destructive/10 text-destructive font-medium",
                      !isToday &&
                        !hasPayments &&
                        isPast &&
                        "text-muted-foreground/50",
                      !isToday && !hasPayments && !isPast && "text-foreground",
                    )}
                    title={
                      hasPayments ?
                        `${payments.length} cobro(s): ${payments.map((p) => p.name).join(", ")}`
                      : undefined
                    }
                  >
                    {day}
                    {hasPayments && !isToday && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                        {payments.length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="flex items-center justify-center gap-4 pt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-primary" />
                <span className="text-muted-foreground">Hoy</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 bg-destructive/20" />
                <span className="text-muted-foreground">Cobro programado</span>
              </div>
            </div>
          </div>
        }
      </CardContent>
    </Card>
  );
}
