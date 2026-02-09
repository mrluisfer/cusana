"use client";

import { CardHeaderIcon } from "@/components/card-header-icon";
import { ServiceIcon } from "@/components/dashboard/service-icon";
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
import { serviceIcons } from "@/constants/icons";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import {
  getNextBillingDate,
  getNextBillingDateFull,
} from "@/utils/get-next-billing-date";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon } from "lucide-react";

// Función de fetch extraída para evitar closures
async function fetchSubscriptionsList(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  const data = await response.json();
  return data.subscriptions ?? [];
}

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
  const userId = session?.user.id;

  const { data: subscriptions, isPending } = useQuery<Subscription[]>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: () => fetchSubscriptionsList(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // Sort by actual next billing date (supports yearly cycles)
  const sortedSubscriptions = subscriptions
    ?.slice()
    .sort((a, b) => {
      const nextA = getNextBillingDateFull({
        billingDay: a.billingDay,
        billingCycle: a.billingCycle,
        createdAt: a.createdAt,
        billingMonth: a.billingMonth,
      });
      const nextB = getNextBillingDateFull({
        billingDay: b.billingDay,
        billingCycle: b.billingCycle,
        createdAt: b.createdAt,
        billingMonth: b.billingMonth,
      });
      return nextA.getTime() - nextB.getTime();
    })
    .slice(0, 5);

  const getUrgencyColor = (sub: Subscription) => {
    const nextDate = getNextBillingDateFull({
      billingDay: sub.billingDay,
      billingCycle: sub.billingCycle,
      createdAt: sub.createdAt,
      billingMonth: sub.billingMonth,
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntil = Math.ceil(
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntil <= 3) return "destructive";
    if (daysUntil <= 7) return "secondary";
    return "outline";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CardHeaderIcon icon={CalendarIcon} />
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
                  <ServiceIcon
                    service={subscription.platform as keyof typeof serviceIcons}
                  />
                  <div>
                    <p className="text-sm font-medium">{subscription.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {getNextBillingDate({
                        billingDay: subscription.billingDay,
                        billingCycle: subscription.billingCycle,
                        createdAt: subscription.createdAt,
                        billingMonth: subscription.billingMonth,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getUrgencyColor(subscription)}>
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
