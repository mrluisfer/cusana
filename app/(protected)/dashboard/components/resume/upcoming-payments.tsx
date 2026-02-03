"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { getNextBillingDate } from "@/utils/get-next-billing-date";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon } from "lucide-react";

function UpcomingPaymentSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export function UpcomingPayments() {
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

  // Ordenar por próximo día de cobro
  const sortedSubscriptions = subscriptions
    ?.slice()
    .sort((a, b) => {
      const today = new Date().getDate();
      const daysUntilA =
        a.billingDay >= today
          ? a.billingDay - today
          : 30 - today + a.billingDay;
      const daysUntilB =
        b.billingDay >= today
          ? b.billingDay - today
          : 30 - today + b.billingDay;
      return daysUntilA - daysUntilB;
    })
    .slice(0, 5);

  const getUrgencyColor = (billingDay: number) => {
    const today = new Date().getDate();
    const daysUntil =
      billingDay >= today ? billingDay - today : 30 - today + billingDay;

    if (daysUntil <= 3) return "destructive";
    if (daysUntil <= 7) return "secondary";
    return "outline";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Próximos Pagos
            </CardTitle>
            <CardDescription className="mt-1">
              Tus próximos cobros programados
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            <ClockIcon className="mr-1 h-3 w-3" />
            {sortedSubscriptions?.length ?? 0} pendientes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {isPending ? (
          <>
            <UpcomingPaymentSkeleton />
            <Separator />
            <UpcomingPaymentSkeleton />
            <Separator />
            <UpcomingPaymentSkeleton />
          </>
        ) : sortedSubscriptions && sortedSubscriptions.length > 0 ? (
          sortedSubscriptions.map((subscription, index) => (
            <div key={subscription.id}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <span className="text-sm font-semibold uppercase">
                      {subscription.platform.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{subscription.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {getNextBillingDate(subscription.billingDay)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getUrgencyColor(subscription.billingDay)}>
                    {currencySymbols[subscription.currency]}
                    {(
                      parseFloat(String(subscription.price)) || 0
                    ).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </Badge>
                </div>
              </div>
              {index < sortedSubscriptions.length - 1 && <Separator />}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            <CalendarIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No hay pagos próximos</p>
            <p className="text-xs">Agrega tu primera suscripción</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
