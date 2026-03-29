"use client";

import { currencyAtom } from "@/atoms";
import { Card, CardContent } from "@/components/ui/card";
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
  monthlyTotal: number;
  yearlyTotal: number;
  yearlyProjection: number;
  subscriptionCount: number;
  monthlySubs: number;
  yearlySubs: number;
}

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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
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
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  const total = Number(data?.total) || 0;
  const monthlyTotal = Number(data?.monthlyTotal) || 0;
  const yearlyProjection = Number(data?.yearlyProjection) || 0;
  const subscriptionCount = Number(data?.subscriptionCount) || 0;

  const cards = [
    {
      title: "Gasto Mensual",
      value: `${total.toLocaleString("es-MX")} ${currency}`,
      icon: WalletIcon,
      accent: "text-primary",
      bgAccent: "bg-primary/10",
    },
    {
      title: "Subs. Mensuales",
      value: `${monthlyTotal.toLocaleString("es-MX")} ${currency}`,
      icon: TrendingUpIcon,
      accent: "text-emerald-500",
      bgAccent: "bg-emerald-500/10",
    },
    {
      title: "Proyección Anual",
      value: `${yearlyProjection.toLocaleString("es-MX")} ${currency}`,
      icon: TrendingDownIcon,
      accent: "text-orange-500",
      bgAccent: "bg-orange-500/10",
    },
    {
      title: "Suscripciones Activas",
      value: `${subscriptionCount}`,
      icon: CalendarClockIcon,
      accent: "text-cyan-500",
      bgAccent: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-0 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgAccent}`}
              >
                <card.icon className={`h-4 w-4 ${card.accent}`} />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground truncate text-[11px] font-medium">
                  {card.title}
                </p>
                <p className="truncate font-mono text-lg font-bold tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
