"use client";

import { currencyAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import {
  CATEGORY_META,
  type CategoryKey,
  computeCategoryBreakdown,
} from "@/utils/subscription-insights";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { AlertTriangleIcon, ChartPieIcon } from "lucide-react";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { useTranslation } from "react-i18next";

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

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <Skeleton className="size-44 rounded-full" />
      <div className="flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-5 w-20" />
        ))}
      </div>
    </div>
  );
}

export function SpendingByCategory() {
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

  const { categories, total, missingRates, skippedCount } = useMemo(
    () =>
      computeCategoryBreakdown(
        subscriptions,
        selectedCurrency,
        ratesData?.rates,
      ),
    [subscriptions, ratesData, selectedCurrency],
  );

  const chartData = useMemo(
    () =>
      categories.map((c) => ({
        category: c.category,
        total: Math.round(c.total),
        count: c.count,
        fill: CATEGORY_META[c.category].color,
      })),
    [categories],
  );

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = { total: { label: t("dashboard.categoryChart.total") } };
    for (const c of categories) {
      config[c.category] = {
        label: t(`dashboard.categories.${c.category}`),
        color: CATEGORY_META[c.category].color,
      };
    }
    return config;
  }, [categories, t]);

  const isPending = isLoadingSubscriptions || isLoadingRates;
  const locale = toIntlLocale(language);
  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] || "$";
  const subscriptionCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={ChartPieIcon} />
          {t("dashboard.categoryChart.title")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.categoryChart.subtitle", { currency: selectedCurrency })}
        </CardDescription>
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
          <CategorySkeleton />
        ) : chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[260px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="category"
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="size-2.5 shrink-0 rounded-[2px]"
                            style={{
                              backgroundColor:
                                CATEGORY_META[name as CategoryKey]?.color,
                            }}
                          />
                          {chartConfig[name as string]?.label ?? name}
                        </span>
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {currencySymbol}
                          {Number(value).toLocaleString(locale, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="total"
                nameKey="category"
                innerRadius={70}
                strokeWidth={4}
              >
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground font-mono text-xl font-bold"
                        >
                          {currencySymbol}
                          {Math.round(total).toLocaleString(locale, {
                            maximumFractionDigits: 0,
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          {t("dashboard.categoryChart.perMonth")}
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 mb-4 flex size-16 items-center justify-center rounded-full">
              <ChartPieIcon className="size-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">
              {t("dashboard.categoryChart.empty")}
            </p>
            <p className="mt-1 text-xs opacity-70">
              {t("dashboard.categoryChart.emptyHint")}
            </p>
          </div>
        )}

        {!isPending && chartData.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {categories.map((c) => (
              <div
                key={c.category}
                className="text-muted-foreground flex items-center gap-1.5 text-xs"
              >
                <span
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: CATEGORY_META[c.category].color }}
                />
                <span className="text-foreground font-medium">
                  {t(`dashboard.categories.${c.category}`)}
                </span>
                <span className="tabular-nums">{c.percent.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}

        {!isPending && chartData.length > 0 && (
          <p className="text-muted-foreground mt-3 text-center text-xs">
            {t("dashboard.distribution.subscriptions", {
              count: subscriptionCount,
            })}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
