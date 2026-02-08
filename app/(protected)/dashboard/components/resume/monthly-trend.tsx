"use client";

import type { MonthlyTrendResponse } from "@/app/api/[userid]/[currency]/monthly-trend/route";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { currencySymbols } from "@/constants/currency";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  BarChart3Icon,
  MinusIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

const MONTHS_TO_SHOW = 6;

async function fetchMonthlyTrend(
  userId: string,
  currency: string,
): Promise<MonthlyTrendResponse> {
  const response = await fetch(
    `/api/${userId}/${currency}/monthly-trend?months=${MONTHS_TO_SHOW}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch monthly trend");
  }
  return response.json();
}

function TrendSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: MONTHS_TO_SHOW }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-7 flex-1" />
        </div>
      ))}
      <Separator />
      <div className="flex justify-between gap-4 pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendIcon({ change }: { change: number }) {
  if (change > 0.5) return <TrendingUpIcon className="h-3 w-3" />;
  if (change < -0.5) return <TrendingDownIcon className="h-3 w-3" />;
  return <MinusIcon className="h-3 w-3" />;
}

function TrendBadge({ change }: { change: number }) {
  const isUp = change > 0.5;
  const isDown = change < -0.5;

  return (
    <Badge
      variant={isUp ? "destructive" : isDown ? "default" : "outline"}
      className="gap-1 text-xs tabular-nums"
    >
      <TrendIcon change={change} />
      {isUp ? "+" : ""}
      {change.toFixed(1)}%
    </Badge>
  );
}

type BarProps = {
  month: string;
  amount: number;
  maxAmount: number;
  isCurrent: boolean;
  subscriptionCount: number;
  currencySymbol: string;
  year: number;
};

function TrendBar({
  month,
  amount,
  maxAmount,
  isCurrent,
  subscriptionCount,
  currencySymbol,
  year,
}: BarProps) {
  const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  const showInnerLabel = percentage > 35;

  const formattedAmount = amount.toLocaleString("es-MX", {
    maximumFractionDigits: 0,
  });

  const bar = (
    <div
      className="flex items-center gap-3"
      role="row"
      aria-label={`${month} ${year}: ${currencySymbol}${formattedAmount}, ${subscriptionCount} suscripciones`}
    >
      <span
        className={cn(
          "w-8 text-right text-xs font-medium",
          isCurrent ? "text-primary font-bold" : "text-muted-foreground",
        )}
        aria-hidden="true"
      >
        {month}
      </span>
      <div className="bg-muted/50 relative h-7 flex-1 overflow-hidden">
        <div
          className={cn(
            "flex h-full items-center justify-end pr-2 transition-all duration-500",
            isCurrent ? "bg-primary" : "bg-primary/40",
          )}
          style={{ width: `${Math.max(percentage, 3)}%` }}
          role="meter"
          aria-valuenow={amount}
          aria-valuemin={0}
          aria-valuemax={maxAmount}
          aria-label={`${currencySymbol}${formattedAmount}`}
        >
          {showInnerLabel && (
            <span className="text-primary-foreground font-mono text-[10px] tabular-nums">
              {currencySymbol}
              {formattedAmount}
            </span>
          )}
        </div>
      </div>
      {!showInnerLabel && (
        <span className="text-muted-foreground min-w-12 font-mono text-xs tabular-nums">
          {currencySymbol}
          {formattedAmount}
        </span>
      )}
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger className="w-full outline-none">{bar}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        <div className="space-y-1">
          <p className="font-medium capitalize">
            {month} {year}
            {isCurrent && (
              <span className="text-primary ml-1 text-[10px] font-normal">
                (actual)
              </span>
            )}
          </p>
          <p className="font-mono text-xs tabular-nums">
            {currencySymbol}
            {amount.toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-muted-foreground text-[10px]">
            {subscriptionCount} suscripción
            {subscriptionCount !== 1 ? "es" : ""} activa
            {subscriptionCount !== 1 ? "s" : ""}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

type StatItemProps = {
  label: string;
  value: string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex-1 text-center">
      <p className="font-mono text-sm font-semibold tabular-nums sm:text-lg">
        {value}
      </p>
      <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
        {label}
      </p>
    </div>
  );
}

export function MonthlyTrend() {
  const { data: session } = useSession();
  const selectedCurrency = useAtomValue(currencyAtom);

  const { data, isPending } = useQuery<MonthlyTrendResponse>({
    queryKey: ["monthly-trend", selectedCurrency],
    queryFn: () => fetchMonthlyTrend(session!.user.id, selectedCurrency),
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 10,
  });

  const currencySymbol =
    currencySymbols[selectedCurrency as keyof typeof currencySymbols] ?? "$";

  const trend = data?.trend ?? [];
  const maxAmount = Math.max(...trend.map((d) => d.amount), 1);
  const hasData = trend.length > 0 && trend.some((t) => t.amount > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CardHeaderIcon icon={BarChart3Icon} />
          Tendencia Mensual
        </CardTitle>
        <CardDescription>
          {isPending ? (
            <Skeleton className="h-3 w-28" />
          ) : hasData ? (
            `Últimos ${trend.length} meses en ${selectedCurrency}`
          ) : (
            "Historial de gastos mensuales"
          )}
        </CardDescription>
        {!isPending && hasData && (
          <CardAction>
            <TrendBadge change={data?.changePercent ?? 0} />
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isPending ? (
          <TrendSkeleton />
        ) : hasData ? (
          <TooltipProvider delay={150}>
            <div className="space-y-4">
              <div
                className="space-y-2"
                role="table"
                aria-label="Tendencia de gastos mensuales"
              >
                {trend.map((item) => (
                  <TrendBar
                    key={`${item.month}-${item.year}`}
                    month={item.month}
                    amount={item.amount}
                    maxAmount={maxAmount}
                    isCurrent={item.isCurrent}
                    subscriptionCount={item.subscriptionCount}
                    currencySymbol={currencySymbol}
                    year={item.year}
                  />
                ))}
              </div>

              <Separator />

              <div
                className="flex items-center gap-2"
                aria-label="Estadísticas de tendencia"
              >
                <StatItem
                  label="Promedio"
                  value={`${currencySymbol}${(data?.average ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`}
                />
                <Separator orientation="vertical" className="h-8" />
                <StatItem
                  label="Máximo"
                  value={`${currencySymbol}${(data?.max ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`}
                />
                <Separator orientation="vertical" className="h-8" />
                <StatItem
                  label="Mínimo"
                  value={`${currencySymbol}${(data?.min ?? 0).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`}
                />
              </div>
            </div>
          </TooltipProvider>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
            <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center">
              <BarChart3Icon className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-sm font-medium">Sin datos de tendencia</p>
            <p className="mt-1 text-xs opacity-70">
              Agrega suscripciones para ver estadísticas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
