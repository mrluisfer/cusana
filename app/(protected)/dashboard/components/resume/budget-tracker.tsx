"use client";

import { currencyAtom, monthlyBudgetAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import { computeCategoryBreakdown } from "@/utils/subscription-insights";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { PencilIcon, WalletIcon } from "lucide-react";
import { useMemo, useState } from "react";
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

export function BudgetTracker() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: session } = useSession();
  const selectedCurrency = useAtomValue(currencyAtom);
  const [budgets, setBudgets] = useAtom(monthlyBudgetAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");

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

  const total = useMemo(
    () =>
      computeCategoryBreakdown(subscriptions, selectedCurrency, ratesData?.rates)
        .total,
    [subscriptions, ratesData, selectedCurrency],
  );

  const isPending = isLoadingSubscriptions || isLoadingRates;
  const locale = toIntlLocale(language);
  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] || "$";
  const budget = budgets[selectedCurrency];

  const formatMoney = (amount: number) =>
    `${currencySymbol}${Math.round(amount).toLocaleString(locale, {
      maximumFractionDigits: 0,
    })}`;

  const startEditing = () => {
    setDraft(budget ? String(budget) : "");
    setIsEditing(true);
  };

  const saveBudget = () => {
    const value = Number.parseFloat(draft);
    if (!Number.isFinite(value) || value <= 0) return;
    setBudgets((prev) => ({ ...prev, [selectedCurrency]: value }));
    setIsEditing(false);
  };

  const percent = budget && budget > 0 ? (total / budget) * 100 : 0;
  const isOver = percent > 100;
  const isNear = percent >= 80 && percent <= 100;

  const indicatorClass = isOver
    ? "[&_[data-slot=progress-indicator]]:bg-destructive"
    : isNear
      ? "[&_[data-slot=progress-indicator]]:bg-amber-500"
      : "[&_[data-slot=progress-indicator]]:bg-emerald-500";

  const statusKey = isOver
    ? "dashboard.budget.overLimit"
    : isNear
      ? "dashboard.budget.nearLimit"
      : "dashboard.budget.onTrack";

  const statusClass = isOver
    ? "text-destructive"
    : isNear
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-sm">
          <span className="flex items-center gap-2">
            <CardHeaderIcon icon={WalletIcon} />
            {t("dashboard.budget.title")}
          </span>
          {budget && !isEditing && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={startEditing}
              aria-label={t("dashboard.budget.edit")}
            >
              <PencilIcon className="size-3.5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveBudget();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                placeholder={t("dashboard.budget.placeholder")}
                className="h-9"
              />
              <span className="text-muted-foreground text-xs font-medium">
                {selectedCurrency}
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                {t("dashboard.budget.cancel")}
              </Button>
              <Button size="sm" onClick={saveBudget} disabled={!draft.trim()}>
                {t("dashboard.budget.save")}
              </Button>
            </div>
          </div>
        ) : isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        ) : !budget ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs">
              {t("dashboard.budget.setPrompt")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={startEditing}
            >
              <WalletIcon className="size-4" />
              {t("dashboard.budget.set")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-lg font-semibold tabular-nums">
                {formatMoney(total)}
              </span>
              <span className="text-muted-foreground text-xs">
                {t("dashboard.budget.ofBudget", {
                  budget: formatMoney(budget),
                })}
              </span>
            </div>
            <Progress
              value={Math.min(percent, 100)}
              className={cn(
                "[&_[data-slot=progress-track]]:h-2",
                indicatorClass,
              )}
            />
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-medium", statusClass)}>
                {t(statusKey)}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {isOver
                  ? t("dashboard.budget.over", {
                      amount: formatMoney(total - budget),
                    })
                  : t("dashboard.budget.remaining", {
                      amount: formatMoney(budget - total),
                    })}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
