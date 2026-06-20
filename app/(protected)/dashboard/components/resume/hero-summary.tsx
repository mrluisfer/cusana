"use client";

import type { ResumeTotalResponse } from "@/app/api/[userid]/[currency]/resume-total/route";
import { currencyAtom } from "@/atoms";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AddSubscription } from "../subscriptions/actions/add-subscription";

async function fetchStats(
  userId: string,
  currency: string,
): Promise<ResumeTotalResponse> {
  const response = await fetch(`/api/${userId}/${currency}/resume-total`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

export function HeroSummary() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const currency = useAtomValue(currencyAtom);
  const symbol = currencySymbols[currency] ?? "$";

  const { data: stats, isPending } = useQuery<ResumeTotalResponse>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, currency],
    queryFn: () => fetchStats(userId!, currency),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const total = Number(stats?.total) || 0;
  const subscriptionCount = Number(stats?.subscriptionCount) || 0;
  const yearlyProjection = Number(stats?.yearlyProjection) || 0;
  const monthlySubs = Number(stats?.monthlySubs) || 0;
  const yearlySubs = Number(stats?.yearlySubs) || 0;

  const formatAmount = (amount: number, decimals = 2) =>
    amount.toLocaleString(toIntlLocale(language), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  const missingRates = stats?.missingRates ?? [];
  const skippedCount = stats?.skippedCount ?? 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {t("dashboard.hero.monthlySpend")}
        </p>
        {isPending ? (
          <Skeleton className="mt-2 h-10 w-44" />
        ) : (
          <p className="mt-1 font-mono text-4xl font-bold tracking-tight">
            {symbol}
            {formatAmount(total)}
          </p>
        )}
        <p className="text-muted-foreground mt-1 text-sm">
          {t("dashboard.hero.activeSubscriptions", { count: subscriptionCount })}
          {subscriptionCount > 0 && (
            <span className="ml-1 text-xs">
              ({t("dashboard.hero.monthly", { count: monthlySubs })}
              {yearlySubs > 0 && (
                <>, {t("dashboard.hero.yearly", { count: yearlySubs })}</>
              )}
              )
            </span>
          )}
        </p>
        {missingRates.length > 0 && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangleIcon className="size-3.5" />
            {t("dashboard.fxWarning.excluded", {
              count: skippedCount,
              currencies: missingRates.join(", "),
            })}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <AddSubscription triggerProps={{ size: "lg" }} />
        <div className="sm:text-right">
          <p className="text-muted-foreground text-[11px] font-medium">
            {t("dashboard.hero.yearlyProjection")}
          </p>
          {isPending ? (
            <Skeleton className="mt-1 h-5 w-20" />
          ) : (
            <p className="font-mono text-lg font-semibold tabular-nums">
              {symbol}
              {formatAmount(yearlyProjection, 0)}
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <p className="text-muted-foreground text-[11px] font-medium">
            {t("dashboard.hero.currency")}
          </p>
          <p className="font-mono text-lg font-semibold">{currency}</p>
        </div>
      </div>
    </div>
  );
}
