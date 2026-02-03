"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { currencySymbols } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PieChartIcon } from "lucide-react";

const COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-primary",
  "bg-secondary",
];

function DistributionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SpendingDistribution() {
  const { data: session } = useSession();

  const { data: subscriptions, isPending } = useQuery<Subscription[]>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, "list"],
    queryFn: async () => {
      const response = await fetch(`/api/${session!.user.id}/subscription`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      const data = await response.json();
      return data.subscriptions ?? [];
    },
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  // Agrupar por plataforma y calcular totales
  const platformTotals =
    subscriptions?.reduce(
      (acc, sub) => {
        const platform = sub.platform;
        if (!acc[platform]) {
          acc[platform] = { total: 0, count: 0, currency: sub.currency };
        }
        acc[platform].total += parseFloat(String(sub.price)) || 0;
        acc[platform].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number; currency: string }>,
    ) ?? {};

  const totalSpending = Object.values(platformTotals).reduce(
    (sum, p) => sum + p.total,
    0,
  );

  const sortedPlatforms = Object.entries(platformTotals)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 6);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Distribución de Gastos
            </CardTitle>
            <CardDescription className="mt-1">
              Por plataforma o servicio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <DistributionSkeleton />
        ) : sortedPlatforms.length > 0 ? (
          <div className="space-y-4">
            {/* Barra de distribución visual */}
            <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
              {sortedPlatforms.map(([platform, data], index) => {
                const percentage = (data.total / totalSpending) * 100;
                return (
                  <div
                    key={platform}
                    className={cn(
                      COLORS[index % COLORS.length],
                      "transition-all",
                    )}
                    style={{ width: `${percentage}%` }}
                    title={`${platform}: ${percentage.toFixed(1)}%`}
                  />
                );
              })}
            </div>

            {/* Lista detallada */}
            <div className="space-y-3">
              {sortedPlatforms.map(([platform, data], index) => {
                const percentage = (data.total / totalSpending) * 100;
                return (
                  <div
                    key={platform}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full",
                          COLORS[index % COLORS.length],
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {platform}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {data.count} suscripción{data.count > 1 ? "es" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {
                          currencySymbols[
                            data.currency as keyof typeof currencySymbols
                          ]
                        }
                        {data.total.toLocaleString("es-MX")}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            <PieChartIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">Sin datos disponibles</p>
            <p className="text-xs">
              Agrega suscripciones para ver la distribución
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
