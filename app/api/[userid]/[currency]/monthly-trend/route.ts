import { getSubscriptionsForTrend } from "@/lib/queries/monthly-trend";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

type MonthData = {
  month: string;
  monthIndex: number;
  year: number;
  amount: number;
  subscriptionCount: number;
  isCurrent: boolean;
};

export type MonthlyTrendResponse = {
  trend: MonthData[];
  average: number;
  max: number;
  min: number;
  changePercent: number;
  currency: string;
};

export async function GET(
  req: NextRequest,
  ctx: RouteContext<{ userid: string; currency: string }>,
) {
  const { userid, currency } = await ctx.params;

  const monthsParam = req.nextUrl.searchParams.get("months");
  const monthsCount = Math.min(
    Math.max(Number.parseInt(monthsParam ?? "6", 10) || 6, 2),
    12,
  );

  const subscriptions = await getSubscriptionsForTrend(userid);

  if (subscriptions.length === 0) {
    return Response.json(
      {
        trend: [],
        average: 0,
        max: 0,
        min: 0,
        changePercent: 0,
        currency,
      } satisfies MonthlyTrendResponse,
      { status: 200 },
    );
  }

  // Fetch exchange rates
  const frankfurterRes = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );

  const ratesData: FrankfurterRatesResponse = await frankfurterRes.json();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

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

  const trend: MonthData[] = [];

  for (let i = 0; i < monthsCount; i++) {
    const offset = monthsCount - 1 - i;
    const targetDate = new Date(currentYear, currentMonth - offset, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    // A subscription was active in this month if createdAt <= last day of month
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    let monthlyAmount = 0;
    let activeCount = 0;

    for (const sub of subscriptions) {
      // Skip if subscription was created after this month
      if (sub.createdAt > endOfMonth) continue;

      const price = Number.parseFloat(String(sub.price)) || 0;
      let converted = price;

      if (sub.currency !== currency) {
        const rate =
          ratesData.rates[sub.currency as keyof typeof ratesData.rates] || 1;
        converted = price / rate;
      }

      // Normalize to monthly
      const monthlyPrice =
        sub.billingCycle === "yearly" ? converted / 12 : converted;

      monthlyAmount += monthlyPrice;
      activeCount++;
    }

    trend.push({
      month: months[targetMonth],
      monthIndex: targetMonth,
      year: targetYear,
      amount: Math.round(monthlyAmount * 100) / 100,
      subscriptionCount: activeCount,
      isCurrent: offset === 0,
    });
  }

  const amounts = trend.map((t) => t.amount);
  const average = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);

  const first = trend[0]?.amount ?? 0;
  const last = trend[trend.length - 1]?.amount ?? 0;
  const changePercent = first > 0 ? ((last - first) / first) * 100 : 0;

  return Response.json(
    {
      trend,
      average: Math.round(average),
      max: Math.round(max),
      min: Math.round(min),
      changePercent: Math.round(changePercent * 10) / 10,
      currency,
    } satisfies MonthlyTrendResponse,
    { status: 200 },
  );
}
