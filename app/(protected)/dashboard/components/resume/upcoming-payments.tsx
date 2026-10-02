"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CardHeaderIcon } from "@/components/card-header-icon";
import {
  PaymentStatusButton,
  PaymentStatusLabel,
} from "@/components/dashboard/payment-status";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import type { serviceIcons } from "@/constants/icons";
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
import {
  getNextBillingDate,
  getNextBillingDateFull,
  toISODate,
} from "@/utils/get-next-billing-date";

// Función de fetch extraída para evitar closures
async function fetchSubscriptionsList(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  const data = await response.json();
  return data.subscriptions ?? [];
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function UpcomingPaymentSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
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
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user.id;
  // Se fija al montar: leer la fecha en cada render es impuro (react/purity).
  const [today] = useState(startOfToday);

  const { data: subscriptions, isPending } = useQuery<Subscription[]>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: () => fetchSubscriptionsList(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const todayISO = toISODate(today);
  // Un año cubre el próximo cobro de cualquier suscripción, incluidas las anuales.
  const { data: paymentRecords } = usePayments(
    todayISO,
    toISODate(
      new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
    ),
  );

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
    const daysUntil = Math.ceil(
      (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntil <= 3) return "destructive";
    if (daysUntil <= 7) return "default";
    if (daysUntil <= 14) return "secondary";
    return "outline";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CardHeaderIcon icon={CalendarIcon} />
            {t("dashboard.upcoming.title")}
          </CardTitle>
          <Badge variant={"default"}>
            <ClockIcon />
            {sortedSubscriptions?.length ?? 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {isPending ? (
          <>
            <UpcomingPaymentSkeleton />
            <UpcomingPaymentSkeleton />
            <UpcomingPaymentSkeleton />
          </>
        ) : sortedSubscriptions && sortedSubscriptions.length > 0 ? (
          sortedSubscriptions.map((subscription, index) => {
            const dueDate = toISODate(
              getNextBillingDateFull({
                billingDay: subscription.billingDay,
                billingCycle: subscription.billingCycle,
                createdAt: subscription.createdAt,
                billingMonth: subscription.billingMonth,
              }),
            );
            const record = paymentRecords?.get(
              paymentKey(subscription.id, dueDate),
            );
            const state = getPaymentState({
              record,
              dueDate,
              today: todayISO,
              createdAt: subscription.createdAt,
            });

            return (
              <div key={subscription.id}>
                <div className="flex items-center justify-between gap-2 py-2.5">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <ServiceIcon
                      service={
                        subscription.platform as keyof typeof serviceIcons
                      }
                      size="xs"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {subscription.name}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {getNextBillingDate(
                          {
                            billingDay: subscription.billingDay,
                            billingCycle: subscription.billingCycle,
                            createdAt: subscription.createdAt,
                            billingMonth: subscription.billingMonth,
                          },
                          language,
                        )}
                        {/* Los próximos cobros están pendientes por defecto;
                            solo se anota cuando ya se marcó como pagado. */}
                        {state === "paid" && (
                          <>
                            {" · "}
                            <PaymentStatusLabel state={state} record={record} />
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge variant={getUrgencyColor(subscription)}>
                      {currencySymbols[subscription.currency]}
                      {(
                        parseFloat(String(subscription.price)) || 0
                      ).toLocaleString(toIntlLocale(language), {
                        minimumFractionDigits: 2,
                      })}
                    </Badge>
                    <PaymentStatusButton
                      subscriptionId={subscription.id}
                      dueDate={dueDate}
                      state={state}
                    />
                  </div>
                </div>
                {index < sortedSubscriptions.length - 1 && <Separator />}
              </div>
            );
          })
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <CalendarIcon className="mx-auto mb-2 size-6 opacity-40" />
            <p className="text-xs">{t("dashboard.upcoming.empty")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
