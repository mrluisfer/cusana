import { getResumeTotalByUser } from "@/lib/queries/resume-total";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

export type ResumeTotalResponse = {
  total: number;
  monthlyTotal: number;
  yearlyTotal: number;
  yearlyProjection: number;
  subscriptionCount: number;
  monthlySubs: number;
  yearlySubs: number;
  currency: string;
  missingRates?: string[];
  skippedCount?: number;
};

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<{ userid: string; currency: string }>,
) {
  const { userid, currency } = await ctx.params;

  const subscriptionsResume = await getResumeTotalByUser(userid);

  if (subscriptionsResume.length === 0) {
    return Response.json(
      {
        total: 0,
        monthlyTotal: 0,
        yearlyTotal: 0,
        yearlyProjection: 0,
        subscriptionCount: 0,
        monthlySubs: 0,
        yearlySubs: 0,
        currency,
      } satisfies ResumeTotalResponse,
      { status: 200 },
    );
  }

  const frankfurterRes = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );
  const ratesData: FrankfurterRatesResponse = await frankfurterRes.json();

  let monthlyFromMonthlySubs = 0; // Sum of monthly sub prices
  let totalFromYearlySubs = 0; // Sum of yearly sub prices
  let monthlySubs = 0;
  let yearlySubs = 0;
  const missingRates = new Set<string>();
  let skippedCount = 0;

  const targetCurrency = currency.toUpperCase();

  for (const sub of subscriptionsResume) {
    const price = parseFloat(String(sub.price)) || 0;
    const subCurrency = String(sub.currency).toUpperCase();

    let converted = price;
    if (subCurrency !== targetCurrency) {
      const rate =
        ratesData.rates?.[subCurrency as keyof typeof ratesData.rates];
      if (!rate || rate <= 0) {
        missingRates.add(subCurrency);
        skippedCount++;
        continue;
      }
      converted = price / rate;
    }

    if (sub.billingCycle === "yearly") {
      totalFromYearlySubs += converted;
      yearlySubs++;
    } else {
      monthlyFromMonthlySubs += converted;
      monthlySubs++;
    }
  }

  const round2 = (n: number) => Math.round(n * 100) / 100;
  const monthlyTotal = monthlyFromMonthlySubs + totalFromYearlySubs / 12;
  const yearlyProjection = monthlyFromMonthlySubs * 12 + totalFromYearlySubs;

  return Response.json(
    {
      total: round2(monthlyTotal),
      monthlyTotal: round2(monthlyFromMonthlySubs),
      yearlyTotal: round2(totalFromYearlySubs),
      yearlyProjection: round2(yearlyProjection),
      subscriptionCount: subscriptionsResume.length,
      monthlySubs,
      yearlySubs,
      currency,
      ...(missingRates.size > 0 && {
        missingRates: [...missingRates],
        skippedCount,
      }),
    } satisfies ResumeTotalResponse,
    { status: 200 },
  );
}
