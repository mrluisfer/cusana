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
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { Subscription } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BarChart3Icon, TrendingUpIcon } from "lucide-react";

function TrendSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-6 flex-1" />
        </div>
      ))}
    </div>
  );
}

export function MonthlyTrend() {
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

  // Simular datos de tendencia mensual (en un caso real vendrían del backend)
  const currentMonth = new Date().getMonth();
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Generar datos de los últimos 6 meses basados en las suscripciones actuales
  const totalCurrent =
    subscriptions?.reduce(
      (sum, sub) => sum + (parseFloat(String(sub.price)) || 0),
      0,
    ) ?? 0;

  // Usar variaciones predefinidas en lugar de Math.random() para mantener consistencia
  const variations = [0.92, 0.95, 0.98, 1.0, 1.02, 1.0];

  const trendData = Array.from({ length: 6 }).map((_, i) => {
    const monthIndex = (currentMonth - 5 + i + 12) % 12;
    // Usar variación predefinida para simular tendencia estable
    const variation = variations[i];
    return {
      month: months[monthIndex],
      amount: Math.round(totalCurrent * variation),
      isCurrent: i === 5,
    };
  });

  const maxAmount = Math.max(...trendData.map((d) => d.amount), 1);
  const avgAmount =
    trendData.reduce((sum, d) => sum + d.amount, 0) / trendData.length;
  const trend =
    trendData.length >= 2 ?
      ((trendData[trendData.length - 1].amount - trendData[0].amount) /
        (trendData[0].amount || 1)) *
      100
    : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              Tendencia Mensual
            </CardTitle>
            <CardDescription className="mt-1">Últimos 6 meses</CardDescription>
          </div>
          <Badge
            variant={trend >= 0 ? "destructive" : "default"}
            className="text-xs"
          >
            <TrendingUpIcon
              className={cn("h-3 w-3 mr-1", trend < 0 && "rotate-180")}
            />
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ?
          <TrendSkeleton />
        : subscriptions && subscriptions.length > 0 ?
          <div className="space-y-3">
            {trendData.map((data) => (
              <div key={data.month} className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-8 text-xs font-medium",
                    data.isCurrent ?
                      "text-primary font-bold"
                    : "text-muted-foreground",
                  )}
                >
                  {data.month}
                </span>
                <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500 flex items-center justify-end pr-2",
                      data.isCurrent ? "bg-primary" : "bg-primary/50",
                    )}
                    style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                  >
                    {(data.amount / maxAmount) * 100 > 30 && (
                      <span className="text-[10px] font-mono text-primary-foreground">
                        {data.amount.toLocaleString("es-MX")}
                      </span>
                    )}
                  </div>
                </div>
                {(data.amount / maxAmount) * 100 <= 30 && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {data.amount.toLocaleString("es-MX")}
                  </span>
                )}
              </div>
            ))}

            {/* Estadísticas adicionales */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold font-mono">
                  {avgAmount.toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Promedio
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-mono">
                  {Math.max(...trendData.map((d) => d.amount)).toLocaleString(
                    "es-MX",
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Máximo
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold font-mono">
                  {Math.min(...trendData.map((d) => d.amount)).toLocaleString(
                    "es-MX",
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Mínimo
                </p>
              </div>
            </div>
          </div>
        : <div className="py-8 text-center text-muted-foreground">
            <BarChart3Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sin datos de tendencia</p>
            <p className="text-xs">
              Agrega suscripciones para ver estadísticas
            </p>
          </div>
        }
      </CardContent>
    </Card>
  );
}
