"use client";

import { currencyAtom } from "@/atoms";
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
import { ServiceIcon } from "@/components/dashboard/service-icon";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currencySymbols } from "@/constants/currency";
import { serviceIcons, type ServiceKey } from "@/constants/icons";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { AlertTriangleIcon, PieChartIcon, TrendingUpIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function DistributionSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="size-8" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

type PlatformData = {
  total: number;
  convertedTotal: number;
  count: number;
  originalCurrency: string;
};

async function fetchSubscriptions(userId: string): Promise<Subscription[]> {
  const response = await fetch(`/api/${userId}/subscription`);
  if (!response.ok) {
    throw new Error("Failed to fetch subscriptions");
  }
  const data = await response.json();
  return data.subscriptions ?? [];
}

async function fetchExchangeRates(
  currency: string,
): Promise<FrankfurterRatesResponse> {
  const response = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }
  return response.json();
}

function getPlatformIcon(platform: string) {
  const service = serviceIcons[platform as ServiceKey];
  if (!service) return null;
  return service;
}

export function SpendingDistribution() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const selectedCurrency = useAtomValue(currencyAtom);

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

  const { totalSpending, sortedPlatforms, missingRates, skippedCount } =
    useMemo(() => {
      if (!subscriptions || !ratesData) {
        return {
          totalSpending: 0,
          sortedPlatforms: [],
          missingRates: [] as string[],
          skippedCount: 0,
        };
      }

      const target = selectedCurrency.toUpperCase();
      const missing = new Set<string>();
      let skipped = 0;
      const totals: Record<string, PlatformData> = {};

      for (const sub of subscriptions) {
        const platform = sub.platform;
        const price = Number.parseFloat(String(sub.price)) || 0;
        const subCurrency = String(sub.currency).toUpperCase();

        let convertedPrice = price;
        if (subCurrency !== target) {
          const rate =
            ratesData.rates?.[subCurrency as keyof typeof ratesData.rates];
          if (!rate || rate <= 0) {
            missing.add(subCurrency);
            skipped++;
            continue;
          }
          convertedPrice = price / rate;
        }

        const monthlyConverted =
          sub.billingCycle === "yearly" ? convertedPrice / 12 : convertedPrice;
        const monthlyOriginal =
          sub.billingCycle === "yearly" ? price / 12 : price;

        if (!totals[platform]) {
          totals[platform] = {
            total: 0,
            convertedTotal: 0,
            count: 0,
            originalCurrency: subCurrency,
          };
        }

        totals[platform].total += monthlyOriginal;
        totals[platform].convertedTotal += monthlyConverted;
        totals[platform].count += 1;
      }

      const total = Object.values(totals).reduce(
        (sum, p) => sum + p.convertedTotal,
        0,
      );

      const sorted = Object.entries(totals)
        .sort(([, a], [, b]) => b.convertedTotal - a.convertedTotal)
        .slice(0, 6);

      return {
        totalSpending: total,
        sortedPlatforms: sorted,
        missingRates: [...missing],
        skippedCount: skipped,
      };
    }, [subscriptions, ratesData, selectedCurrency]);

  const isPending = isLoadingSubscriptions || isLoadingRates;
  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] || "$";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={PieChartIcon} />
          {t("dashboard.distribution.title")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.distribution.byPlatform", {
            currency: selectedCurrency,
          })}
        </CardDescription>
        {!isPending && sortedPlatforms.length > 0 && (
          <CardAction>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">
                {t("dashboard.distribution.totalMonthly")}
              </p>
              <p className="font-mono text-lg font-semibold tracking-tight">
                {currencySymbol}
                {totalSpending.toLocaleString(toIntlLocale(language), {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {!isPending && missingRates.length > 0 && (
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangleIcon className="size-3.5" />
            {t("dashboard.fxWarning.excluded", {
              count: skippedCount,
              currencies: missingRates.join(", "),
            })}
          </p>
        )}
        {isPending ? (
          <DistributionSkeleton />
        ) : sortedPlatforms.length > 0 ? (
          <div className="space-y-5">
            <TooltipProvider>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {t("dashboard.distribution.distribution")}
                  </span>
                  <span className="text-muted-foreground">
                    {t("dashboard.distribution.platforms", {
                      count: sortedPlatforms.length,
                    })}
                  </span>
                </div>
                <div className="bg-muted/50 flex h-5 w-full gap-px overflow-hidden p-0.5">
                  {sortedPlatforms.map(([platform, data]) => {
                    const percentage =
                      totalSpending > 0
                        ? (data.convertedTotal / totalSpending) * 100
                        : 0;
                    const service = getPlatformIcon(platform);
                    const color = service?.color ?? "#64748B";

                    return (
                      <Tooltip key={platform}>
                        <TooltipTrigger
                          className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                          style={{
                            width: `${Math.max(percentage, 2)}%`,
                            backgroundColor: color,
                          }}
                        />
                        <TooltipContent side="top">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {service?.label ?? platform}
                            </p>
                            <p className="text-xs">
                              {currencySymbol}
                              {data.convertedTotal.toLocaleString(
                                toIntlLocale(language),
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                },
                              )}{" "}
                              {t("dashboard.distribution.perMonth")}
                            </p>
                            <p className="text-xs font-medium">
                              {t("dashboard.distribution.ofTotal", {
                                percent: percentage.toFixed(1),
                              })}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </TooltipProvider>

            <ItemGroup>
              {sortedPlatforms.map(([platform, data], index) => {
                const percentage =
                  totalSpending > 0
                    ? (data.convertedTotal / totalSpending) * 100
                    : 0;
                const isTopSpender = index === 0;
                const label =
                  serviceIcons[platform as ServiceKey]?.label ?? platform;

                return (
                  <Item
                    key={platform}
                    variant={isTopSpender ? "muted" : "default"}
                  >
                    <ItemMedia variant="icon">
                      <ServiceIcon service={platform as ServiceKey} size="xs" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        <span>{label}</span>
                        {isTopSpender && (
                          <Badge
                            variant="secondary"
                            className="h-5 gap-1 bg-amber-500/10 px-1.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
                          >
                            <TrendingUpIcon className="size-3" />
                            {t("dashboard.distribution.top")}
                          </Badge>
                        )}
                      </ItemTitle>
                      <ItemDescription>
                        {t("dashboard.distribution.subscriptions", {
                          count: data.count,
                        })}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <div className="text-right">
                        <p className="font-mono text-sm font-semibold tabular-nums">
                          {currencySymbol}
                          {data.convertedTotal.toLocaleString(
                            toIntlLocale(language),
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            },
                          )}{" "}
                          <span className="text-xs">{selectedCurrency}</span>
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          {t("dashboard.distribution.perMonth")}
                        </p>
                      </div>
                      <Badge
                        variant="default"
                        className={cn(
                          "justify-center font-mono text-xs tabular-nums",
                        )}
                      >
                        {percentage.toFixed(0)}%
                      </Badge>
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          </div>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 mb-4 flex size-16 items-center justify-center">
              <PieChartIcon className="size-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">
              {t("dashboard.distribution.emptyTitle")}
            </p>
            <p className="mt-1 text-xs opacity-70">
              {t("dashboard.distribution.emptyHint")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
