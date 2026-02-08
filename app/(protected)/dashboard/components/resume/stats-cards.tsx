"use client";

import { currencyAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
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

// Función de fetch extraída para evitar closures
async function fetchStats(
  userId: string,
  currency: string,
): Promise<StatsData> {
  const response = await fetch(`/api/${userId}/${currency}/resume-total`);
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-8 w-32" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const currency = useAtomValue(currencyAtom);

  const { data, isPending } = useQuery<StatsData>({
    queryKey: [QueryKeys.SUBSCRIPTIONS, currency],
    queryFn: () => fetchStats(userId!, currency),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  const total = Number(data?.total) || 0;
  const monthlyAvg = Number(data?.monthlyAvg) || total;
  const yearlyProjection = Number(data?.yearlyProjection) || total * 12;
  const subscriptionCount = Number(data?.subscriptionCount) || 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Gasto Mensual
          </CardTitle>
          {/* <WalletIcon className="text-muted-foreground h-4 w-4" /> */}
          <CardHeaderIcon icon={WalletIcon} />
        </CardHeader>
        <CardContent>
          <div className="font-mono text-2xl font-bold">
            {total.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="mt-1 flex items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              Total actual
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Promedio Mensual
          </CardTitle>
          <CardHeaderIcon icon={TrendingUpIcon} />
        </CardHeader>
        <CardContent>
          <div className="font-mono text-2xl font-bold">
            {monthlyAvg.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="mt-1 flex items-center gap-1">
            <TrendingUpIcon className="h-3 w-3 text-emerald-500" />
            <span className="text-xs text-emerald-500">Estable</span>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Proyección Anual
          </CardTitle>
          <CardHeaderIcon icon={TrendingDownIcon} />
        </CardHeader>
        <CardContent>
          <div className="font-mono text-2xl font-bold">
            {yearlyProjection.toLocaleString("es-MX")} {currency}
          </div>
          <CardDescription className="mt-1 flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              12 meses
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Suscripciones
          </CardTitle>
          <CardHeaderIcon icon={CalendarClockIcon} />
        </CardHeader>
        <CardContent>
          <div className="font-mono text-2xl font-bold">
            {subscriptionCount}
          </div>
          <CardDescription className="mt-1 flex items-center gap-1">
            <Badge variant="default" className="text-xs">
              Activas
            </Badge>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
