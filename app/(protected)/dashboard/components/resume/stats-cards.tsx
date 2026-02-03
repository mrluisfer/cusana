"use client";

import { currencyAtom } from "@/atoms";
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
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import {
  CalendarClockIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";

interface StatsData {
  total: number;
  currency: string;
  monthlyAvg: number;
  yearlyProjection: number;
  subscriptionCount: number;
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data: session } = useSession();
  const currency = useAtomValue(currencyAtom);

  const { data, isPending } = useQuery<StatsData>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, currency],
    queryFn: async () => {
      const response = await fetch(
        `/api/${session!.user.id}/${currency}/resume-total`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
    enabled: !!session?.user.id,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  const total = data?.total ?? 0;
  const monthlyAvg = data?.monthlyAvg ?? total;
  const yearlyProjection = data?.yearlyProjection ?? total * 12;
  const subscriptionCount = data?.subscriptionCount ?? 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gasto Mensual
          </CardTitle>
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {total.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Badge variant="secondary" className="text-xs">
              Total actual
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Promedio Mensual
          </CardTitle>
          <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {monthlyAvg.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <TrendingUpIcon className="h-3 w-3 text-emerald-500" />
            <span className="text-emerald-500 text-xs">Estable</span>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Proyección Anual
          </CardTitle>
          <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {yearlyProjection.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Badge variant="outline" className="text-xs">
              12 meses
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Suscripciones
          </CardTitle>
          <CalendarClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {subscriptionCount}
          </div>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Badge variant="default" className="text-xs">
              Activas
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
