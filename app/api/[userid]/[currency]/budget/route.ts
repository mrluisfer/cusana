import { currencyArray, type Currency } from "@/constants/currency";
import {
  getBudgetForPeriod,
  getLatestBudgetBefore,
  upsertBudget,
} from "@/lib/queries/budgets";
import { normalizePeriod } from "@/lib/period";
import type { RouteContext } from "@/types/route-context";
import type { NextRequest } from "next/server";

export type BudgetResponse = {
  /** Monto del presupuesto, o null si nunca se ha definido uno. */
  budget: number | null;
  /** Mes al que aplica (YYYY-MM-01). */
  period: string;
  currency: string;
  /** true cuando el monto se hereda de un mes anterior y aún no está guardado para `period`. */
  inherited: boolean;
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

  const period = normalizePeriod(req.nextUrl.searchParams.get("period"));

  // 1. ¿Hay presupuesto propio para este mes?
  const own = await getBudgetForPeriod(userid, currency, period);
  if (own) {
    return Response.json(
      {
        budget: Number(own.amount),
        period,
        currency,
        inherited: false,
      } satisfies BudgetResponse,
      { status: 200 },
    );
  }

  // 2. Si no, heredar el del último mes con presupuesto definido.
  const previous = await getLatestBudgetBefore(userid, currency, period);
  if (previous) {
    return Response.json(
      {
        budget: Number(previous.amount),
        period,
        currency,
        inherited: true,
      } satisfies BudgetResponse,
      { status: 200 },
    );
  }

  // 3. Nunca se ha definido un presupuesto.
  return Response.json(
    { budget: null, period, currency, inherited: false } satisfies BudgetResponse,
    { status: 200 },
  );
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<{ userid: string; currency: string }>,
) {
  const { userid, currency } = await ctx.params;

  if (!isValidCurrency(currency)) {
    return Response.json({ message: "Invalid currency" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const amount = Number(body?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return Response.json(
      { message: "A positive amount is required" },
      { status: 400 },
    );
  }

  const period = normalizePeriod(body?.period);

  const result = await upsertBudget(userid, currency, period, amount);

  if (!result || result.length === 0) {
    return Response.json(
      { message: "Failed to save the budget" },
      { status: 500 },
    );
  }

  return Response.json(
    {
      budget: Number(result[0].amount),
      period,
      currency,
      inherited: false,
    } satisfies BudgetResponse,
    { status: 200 },
  );
}
