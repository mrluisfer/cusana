import { currencyArray, type Currency } from "@/constants/currency";
import { getBudgetHistory } from "@/lib/queries/budgets";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

export type BudgetHistoryResponse = {
  history: { period: string; amount: number }[];
  currency: string;
};

function isValidCurrency(value: string): value is Currency {
  return (currencyArray as readonly string[]).includes(value);
}

export async function GET(
  req: NextRequest,
  ctx: RouteContext<{ userid: string; currency: string }>,
) {
  const { userid, currency } = await ctx.params;

  if (!isValidCurrency(currency)) {
    return Response.json({ message: "Invalid currency" }, { status: 400 });
  }

  const limitParam = req.nextUrl.searchParams.get("limit");
  const limit = Math.min(Math.max(Number.parseInt(limitParam ?? "12", 10) || 12, 1), 24);

  const rows = await getBudgetHistory(userid, currency, limit);

  return Response.json(
    {
      history: rows.map((row) => ({
        period: String(row.period),
        amount: Number(row.amount),
      })),
      currency,
    } satisfies BudgetHistoryResponse,
    { status: 200 },
  );
}
