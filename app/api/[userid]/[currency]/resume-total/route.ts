import { getResumeTotalByUser } from "@/lib/queries/resume-total";
import { FrankfurterRatesResponse } from "@/types/frankfurter";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<{ userid: string; currency: string }>,
) {
  const { userid, currency } = await ctx.params;

  const subscriptionsResume = await getResumeTotalByUser(userid);

  // return Response.json({ total }, { status: 200 });
  if (subscriptionsResume.length === 0) {
    return Response.json(
      {
        message: "No subscriptions found",
        total: 0,
        monthlyAvg: 0,
        yearlyProjection: 0,
        subscriptionCount: 0,
        currency,
      },
      { status: 200 },
    );
  }

  const frankfurterRes = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );

  const ratesData: FrankfurterRatesResponse = await frankfurterRes.json();

  let monthlyTotal = 0;
  let yearlyTotal = 0;

  subscriptionsResume.forEach((sub) => {
    const rate =
      ratesData.rates[sub.currency as keyof typeof ratesData.rates] || 1;

    const price = parseFloat(String(sub.price)) || 0;
    let priceInSelectedCurrency = price;
    if (sub.currency !== currency) {
      priceInSelectedCurrency = price / rate;
    }

    // Calcular según el ciclo de facturación
    if (sub.billingCycle === "yearly") {
      yearlyTotal += priceInSelectedCurrency;
      monthlyTotal += priceInSelectedCurrency / 12;
    } else {
      monthlyTotal += priceInSelectedCurrency;
      yearlyTotal += priceInSelectedCurrency * 12;
    }
  });

  return Response.json(
    {
      total: Math.round(monthlyTotal),
      monthlyAvg: Math.round(monthlyTotal),
      yearlyProjection: Math.round(yearlyTotal),
      subscriptionCount: subscriptionsResume.length,
      currency,
    },
    { status: 200 },
  );
}
