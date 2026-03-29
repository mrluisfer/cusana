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

  for (const sub of subscriptionsResume) {
    const price = parseFloat(String(sub.price)) || 0;

    let converted = price;
    if (sub.currency !== currency) {
      const rate =
        ratesData.rates[sub.currency as keyof typeof ratesData.rates] || 1;
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

  // Monthly effective cost: monthly subs + yearly subs amortized
  const monthlyTotal =
    monthlyFromMonthlySubs + totalFromYearlySubs / 12;

  // Yearly projection: monthly subs * 12 + yearly subs as-is
  const yearlyProjection =
    monthlyFromMonthlySubs * 12 + totalFromYearlySubs;

  return Response.json(
    {
      total: Math.round(monthlyTotal),
      monthlyTotal: Math.round(monthlyFromMonthlySubs),
      yearlyTotal: Math.round(totalFromYearlySubs),
      yearlyProjection: Math.round(yearlyProjection),
      subscriptionCount: subscriptionsResume.length,
      monthlySubs,
      yearlySubs,
      currency,
    } satisfies ResumeTotalResponse,
    { status: 200 },
  );
}
