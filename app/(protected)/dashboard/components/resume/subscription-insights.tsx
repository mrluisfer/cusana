"use client";

import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  CalendarClockIcon,
  CrownIcon,
  Layers2Icon,
  LayersIcon,
  LightbulbIcon,
  type LucideIcon,
  Trash2Icon,
  TrendingUpIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { currencyAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_CLASSES } from "@/constants/chart-colors";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import {
  computeCategoryBreakdown,
  convertToTarget,
  getMonthlyAmount,
} from "@/utils/subscription-insights";

type InsightTone = "info" | "warning" | "success";

type Insight = {
  id: string;
  text: string;
  icon: LucideIcon;
  tone: InsightTone;
};

const toneStyles: Record<InsightTone, string> = {
  info: STATUS_CLASSES.info.tone,
  warning: STATUS_CLASSES.warning.tone,
  success: STATUS_CLASSES.ok.tone,
};

async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) throw new Error("Failed to fetch subscriptions");
  const data = await response.json();
  return data.subscriptions ?? [];
}

async function fetchExchangeRates(
  currency: string,
): Promise<FrankfurterRatesResponse> {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );
  if (!response.ok) throw new Error("Failed to fetch exchange rates");
  return response.json();
}

function InsightsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <Skeleton className="h-8 flex-1" />
        </div>
      ))}
    </div>
  );
}

export function SubscriptionInsights() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const selectedCurrency = useAtomValue(currencyAtom);
  const [hideInsights, setHideInsights] = useState(false);

  const { data: subscriptions, isPending: isLoadingSubscriptions } = useQuery<
    Subscription[]
  >({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: () => fetchSubscriptions(session!.user.id),
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: ratesData, isPending: isLoadingRates } =
    useQuery<FrankfurterRatesResponse>({
      queryKey: ["exchange-rates", selectedCurrency],
      queryFn: () => fetchExchangeRates(selectedCurrency),
      staleTime: 1000 * 60 * 30,
    });

  const isPending = isLoadingSubscriptions || isLoadingRates;
  const locale = toIntlLocale(language);
  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] || "$";

  const formatMoney = (amount: number) =>
    `${currencySymbol}${Math.round(amount).toLocaleString(locale, {
      maximumFractionDigits: 0,
    })}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: formatMoney se recrea en cada render; sus entradas reales (locale, currencySymbol) ya están en la lista.
  const insights = useMemo<Insight[]>(() => {
    if (!subscriptions || !ratesData) return [];

    const result: Insight[] = [];
    const { categories, total } = computeCategoryBreakdown(
      subscriptions,
      selectedCurrency,
      ratesData.rates,
    );

    // 1) Where most of the money goes.
    const top = categories[0];
    if (top && top.percent > 0) {
      result.push({
        id: "topCategory",
        icon: TrendingUpIcon,
        tone: "info",
        text: t("dashboard.insights.items.topCategory", {
          category: t(`dashboard.categories.${top.category}`),
          percent: top.percent.toFixed(0),
        }),
      });
    }

    // 2) Overlapping services in a single category → consolidation opportunity.
    const consolidatable = [...categories]
      .filter((c) => c.platforms >= 2)
      .sort((a, b) => b.platforms - a.platforms)[0];
    if (consolidatable) {
      result.push({
        id: "consolidate",
        icon: Layers2Icon,
        tone: "warning",
        text: t("dashboard.insights.items.consolidate", {
          count: consolidatable.platforms,
          category: t(`dashboard.categories.${consolidatable.category}`),
        }),
      });
    }

    // 3) Most expensive single active subscription.
    let biggest: { name: string; amount: number } | null = null;
    for (const sub of subscriptions) {
      if (sub.active === false) continue;
      const converted = convertToTarget(
        getMonthlyAmount(sub),
        String(sub.currency),
        selectedCurrency,
        ratesData.rates,
      );
      if (converted === null) continue;
      if (!biggest || converted > biggest.amount) {
        biggest = { name: sub.name, amount: converted };
      }
    }
    if (biggest) {
      result.push({
        id: "biggest",
        icon: CrownIcon,
        tone: "info",
        text: t("dashboard.insights.items.biggest", {
          name: biggest.name,
          amount: formatMoney(biggest.amount),
        }),
      });
    }

    // 4) Inactive subscriptions the user could remove.
    const inactiveCount = subscriptions.filter(
      (s) => s.active === false,
    ).length;
    if (inactiveCount > 0) {
      result.push({
        id: "inactive",
        icon: Trash2Icon,
        tone: "warning",
        text: t("dashboard.insights.items.inactive", { count: inactiveCount }),
      });
    }

    // 5) Yearly projection of current commitments.
    if (total > 0) {
      result.push({
        id: "yearly",
        icon: CalendarClockIcon,
        tone: "success",
        text: t("dashboard.insights.items.yearly", {
          amount: formatMoney(total * 12),
        }),
      });
    }

    return result.slice(0, 4);
  }, [subscriptions, ratesData, selectedCurrency, t, locale, currencySymbol]);

  if (hideInsights)
    return (
      <Button onClick={() => setHideInsights(false)}>
        <LightbulbIcon />
        {t("dashboard.insights.show")}
      </Button>
    );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={LightbulbIcon} />
          {t("dashboard.insights.title")}
        </CardTitle>
        <CardDescription>{t("dashboard.insights.subtitle")}</CardDescription>
        <CardAction>
          <Button
            onClick={() => setHideInsights(true)}
            size={"icon"}
            aria-label={t("dashboard.insights.hide")}
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <InsightsSkeleton />
        ) : insights.length > 0 ? (
          <ul className="space-y-2.5">
            {insights.map((insight) => (
              <li
                key={insight.id}
                className="flex items-start gap-3 rounded-lg bg-muted/40 p-3"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    toneStyles[insight.tone],
                  )}
                >
                  <insight.icon className="size-4" />
                </span>
                <p className="text-pretty text-foreground text-sm leading-snug">
                  {insight.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted/50">
              <LayersIcon className="size-8 opacity-40" />
            </div>
            <p className="font-medium text-sm">
              {t("dashboard.insights.empty")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
