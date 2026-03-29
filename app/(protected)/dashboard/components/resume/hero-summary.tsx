"use client";

import type { ResumeTotalResponse } from "@/app/api/[userid]/[currency]/resume-total/route";
import { currencyAtom } from "@/atoms";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";

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
    amount.toLocaleString("es-MX", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Gasto mensual efectivo
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
          {subscriptionCount} suscripción
          {subscriptionCount !== 1 ? "es" : ""} activa
          {subscriptionCount !== 1 ? "s" : ""}
          {subscriptionCount > 0 && (
            <span className="ml-1 text-xs">
              ({monthlySubs} mensual{monthlySubs !== 1 ? "es" : ""}
              {yearlySubs > 0 && (
                <>, {yearlySubs} anual{yearlySubs !== 1 ? "es" : ""}</>
              )}
              )
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="sm:text-right">
          <p className="text-muted-foreground text-[11px] font-medium">
            Proyección anual
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
            Moneda
          </p>
          <p className="font-mono text-lg font-semibold">{currency}</p>
        </div>
      </div>
    </div>
  );
}
