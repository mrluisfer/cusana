"use client";

import type { BudgetHistoryResponse } from "@/app/api/[userid]/[currency]/budget/history/route";
import type { MonthlyTrendResponse } from "@/app/api/[userid]/[currency]/monthly-trend/route";
import { currencyAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import { toPeriod } from "@/lib/period";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { HistoryIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const MONTHS_TO_SHOW = 6;

async function fetchMonthlyTrend(
  userId: string,
  currency: string,
): Promise<MonthlyTrendResponse> {
  const response = await fetch(
    `/api/${userId}/${currency}/monthly-trend?months=${MONTHS_TO_SHOW}`,
  );
  if (!response.ok) throw new Error("Failed to fetch monthly trend");
  return response.json();
}

async function fetchBudgetHistory(
  userId: string,
  currency: string,
): Promise<BudgetHistoryResponse> {
  const response = await fetch(`/api/${userId}/${currency}/budget/history`);
  if (!response.ok) throw new Error("Failed to fetch budget history");
  return response.json();
}

type Row = {
  key: string;
  month: string;
  year: number;
  spent: number;
  budget: number | null;
  isCurrent: boolean;
};

function HistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: MONTHS_TO_SHOW }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-7 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function HistoryBar({
  row,
  maxSpent,
  currencySymbol,
  locale,
}: {
  row: Row;
  maxSpent: number;
  currencySymbol: string;
  locale: string;
}) {
  const { t } = useTranslation();
  const fmt = (n: number) =>
    `${currencySymbol}${Math.round(n).toLocaleString(locale, {
      maximumFractionDigits: 0,
    })}`;

  const hasBudget = row.budget !== null && row.budget > 0;
  const ratio = hasBudget ? row.spent / (row.budget as number) : 0;
  const isOver = hasBudget && ratio > 1;
  const isNear = hasBudget && ratio >= 0.8 && ratio <= 1;

  // Con presupuesto: el ancho del track representa el presupuesto y el relleno
  // el gasto, así un mes "sobre presupuesto" se ve lleno y en rojo.
  // Sin presupuesto: barra gris relativa al mayor gasto del periodo.
  const fillPercent = hasBudget
    ? Math.min(ratio, 1) * 100
    : maxSpent > 0
      ? (row.spent / maxSpent) * 100
      : 0;

  const fillClass = !hasBudget
    ? "bg-muted-foreground/30"
    : isOver
      ? "bg-destructive"
      : isNear
        ? "bg-amber-500"
        : "bg-emerald-500";

  const diff = hasBudget ? (row.budget as number) - row.spent : 0;

  const bar = (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "w-8 text-right text-xs font-medium",
          row.isCurrent ? "text-primary font-bold" : "text-muted-foreground",
        )}
      >
        {row.month}
      </span>
      <div className="bg-muted/50 relative h-7 flex-1 overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500", fillClass)}
          style={{ width: `${Math.max(fillPercent, 3)}%` }}
        />
      </div>
      <span className="text-muted-foreground min-w-20 text-right font-mono text-xs tabular-nums">
        {hasBudget ? `${fmt(row.spent)} / ${fmt(row.budget as number)}` : fmt(row.spent)}
      </span>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger className="w-full outline-none">{bar}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <div className="space-y-1">
          <p className="font-medium capitalize">
            {row.month} {row.year}
          </p>
          <p className="font-mono text-xs tabular-nums">
            {t("dashboard.budgetHistory.spent")}: {fmt(row.spent)}
          </p>
          {hasBudget ? (
            <>
              <p className="font-mono text-xs tabular-nums">
                {t("dashboard.budget.title")}: {fmt(row.budget as number)}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isOver
                    ? "text-destructive"
                    : "text-emerald-600 dark:text-emerald-400",
                )}
              >
                {isOver
                  ? t("dashboard.budget.over", { amount: fmt(-diff) })
                  : t("dashboard.budget.remaining", { amount: fmt(diff) })}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-xs">
              {t("dashboard.budgetHistory.noBudget")}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function BudgetHistory() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const selectedCurrency = useAtomValue(currencyAtom);
  const locale = toIntlLocale(language);

  const { data: trendData, isPending: isLoadingTrend } =
    useQuery<MonthlyTrendResponse>({
      // Misma key que MonthlyTrend para compartir caché.
      queryKey: [QueryKeys.SUBSCRIPTIONS, "monthly-trend", selectedCurrency],
      queryFn: () => fetchMonthlyTrend(session!.user.id, selectedCurrency),
      enabled: !!session?.user.id,
      staleTime: 1000 * 60 * 10,
    });

  const { data: budgetHistory, isPending: isLoadingBudgets } =
    useQuery<BudgetHistoryResponse>({
      queryKey: [QueryKeys.BUDGET, "history", selectedCurrency],
      queryFn: () => fetchBudgetHistory(session!.user.id, selectedCurrency),
      enabled: !!session?.user.id,
      staleTime: 1000 * 60 * 5,
    });

  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] ?? "$";

  const rows = useMemo<Row[]>(() => {
    const trend = trendData?.trend ?? [];
    const budgetByPeriod = new Map(
      (budgetHistory?.history ?? []).map((b) => [b.period, b.amount]),
    );

    return trend.map((item) => {
      const period = toPeriod(item.year, item.monthIndex + 1);
      return {
        key: `${item.year}-${item.monthIndex}`,
        month: item.month,
        year: item.year,
        spent: item.amount,
        budget: budgetByPeriod.get(period) ?? null,
        isCurrent: item.isCurrent,
      };
    });
  }, [trendData, budgetHistory]);

  const isPending = isLoadingTrend || isLoadingBudgets;
  const hasAnyBudget = rows.some((r) => r.budget !== null);
  const maxSpent = Math.max(...rows.map((r) => r.spent), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={HistoryIcon} />
          {t("dashboard.budgetHistory.title")}
        </CardTitle>
        <CardDescription>
          {isPending ? (
            <Skeleton className="h-3 w-40" />
          ) : (
            t("dashboard.budgetHistory.description")
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <HistorySkeleton />
        ) : hasAnyBudget ? (
          <TooltipProvider>
            <div className="space-y-2">
              {rows.map((row) => (
                <HistoryBar
                  key={row.key}
                  row={row}
                  maxSpent={maxSpent}
                  currencySymbol={currencySymbol}
                  locale={locale}
                />
              ))}
            </div>
          </TooltipProvider>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 mb-4 flex size-16 items-center justify-center">
              <HistoryIcon className="size-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">
              {t("dashboard.budgetHistory.empty")}
            </p>
            <p className="mt-1 text-xs opacity-70">
              {t("dashboard.budgetHistory.emptyHint")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
