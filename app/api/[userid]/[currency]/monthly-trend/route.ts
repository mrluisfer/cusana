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
  missingRates?: string[];
  skippedCount?: number;
};

const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

/**
 * Determines if a subscription was active during a given month.
 *
 * - It must have been created on or before the last day of the month.
 * - If it's currently inactive, it must have been deactivated AFTER the
 *   first day of the month (updatedAt is used as proxy for deactivation date).
 */
function wasActiveInMonth(
  sub: { createdAt: Date; active: boolean; updatedAt: Date },
  monthStart: Date,
  monthEnd: Date,
): boolean {
  // Not yet created
  if (sub.createdAt > monthEnd) return false;

  // Still active — was definitely active in this month
  if (sub.active) return true;

  // Inactive — check if it was deactivated after this month started
  // (updatedAt >= monthStart means it was still active at the start of the month)
  return sub.updatedAt >= monthStart;
}

/**
 * For a given subscription and target month, returns the actual amount
 * the user would pay that month:
 *
 * - Monthly subs: full price every month
 * - Yearly subs: full price only in the billing month, $0 otherwise
 */
function getMonthlyAmount(
  sub: {
    price: string;
    billingCycle: string;
    billingMonth: number | null;
    createdAt: Date;
    currency: string;
  },
  targetMonth: number,
  targetCurrency: string,
  rates: FrankfurterRatesResponse["rates"],
): number | null {
  const price = Number.parseFloat(String(sub.price)) || 0;
  const subCurrency = String(sub.currency).toUpperCase();

  let converted = price;
  if (subCurrency !== targetCurrency) {
    const rate = rates?.[subCurrency as keyof typeof rates];
    if (!rate || rate <= 0) return null;
    converted = price / rate;
  }

  if (sub.billingCycle === "yearly") {
    // Determine which month the yearly payment falls on
    const billingMonth = sub.billingMonth
      ? sub.billingMonth - 1 // 1-12 → 0-11
      : new Date(sub.createdAt).getMonth();

    // Only charge in the billing month
    return targetMonth === billingMonth ? converted : 0;
  }

  // Monthly: full price
  return converted;
}

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

  const frankfurterRes = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );
  const ratesData: FrankfurterRatesResponse = await frankfurterRes.json();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const targetCurrency = currency.toUpperCase();

  const trend: MonthData[] = [];
  const missingRates = new Set<string>();
  const skippedSubs = new Set<string>();

  for (let i = 0; i < monthsCount; i++) {
    const offset = monthsCount - 1 - i;
    const targetDate = new Date(currentYear, currentMonth - offset, 1);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    let monthlyAmount = 0;
    let activeCount = 0;

    for (const sub of subscriptions) {
      if (!wasActiveInMonth(sub, monthStart, monthEnd)) continue;

      const amount = getMonthlyAmount(
        sub,
        targetMonth,
        targetCurrency,
        ratesData.rates,
      );

      if (amount === null) {
        missingRates.add(String(sub.currency).toUpperCase());
        skippedSubs.add(sub.id);
        continue;
      }

      activeCount++;
      monthlyAmount += amount;
    }

    trend.push({
      month: MONTH_NAMES[targetMonth],
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

  // Change percent: current vs most recent prior month with data.
  // Walking backwards skips leading zeros (subs created mid-window) that
  // would otherwise force the result to 0 via the divide-by-zero guard.
  const last = trend[trend.length - 1]?.amount ?? 0;
  let baseline = 0;
  for (let i = trend.length - 2; i >= 0; i--) {
    if (trend[i].amount > 0) {
      baseline = trend[i].amount;
      break;
    }
  }
  const changePercent =
    baseline > 0 ? ((last - baseline) / baseline) * 100 : last > 0 ? 100 : 0;

  return Response.json(
    {
      trend,
      average: Math.round(average),
      max: Math.round(max),
      min: Math.round(min),
      changePercent: Math.round(changePercent * 10) / 10,
      currency,
      ...(missingRates.size > 0 && {
        missingRates: [...missingRates],
        skippedCount: skippedSubs.size,
      }),
    } satisfies MonthlyTrendResponse,
    { status: 200 },
  );
}
