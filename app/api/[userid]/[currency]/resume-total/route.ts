import { getResumeTotalByUser } from "@/lib/queries/resume-total";
import { FrankfurterRatesResponse } from "@/types/frankfurter";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/[userid]/[currency]/resume-total">,
) {
  const { userid, currency } = await ctx.params;

  const subscriptionsResume = await getResumeTotalByUser(userid);

  // return Response.json({ total }, { status: 200 });
  if (subscriptionsResume.length === 0) {
    return Response.json(
      { message: "No subscriptions found", total: 0 },
      { status: 404 },
    );
  }

  const frankfurterRes = await fetch(
    `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=MXN,EUR,USD`,
  );

  const ratesData: FrankfurterRatesResponse = await frankfurterRes.json();

  const totalInSelectedCurrency = subscriptionsResume.reduce((acc, sub) => {
    const rate =
      ratesData.rates[sub.currency as keyof typeof ratesData.rates] || 1;

    let priceInSelectedCurrency = sub.price;
    if (sub.currency !== currency) {
      priceInSelectedCurrency = sub.price / rate;
    }

    return acc + priceInSelectedCurrency;
  }, 0);

  return Response.json(
    { total: totalInSelectedCurrency, currency },
    { status: 200 },
  );
}
