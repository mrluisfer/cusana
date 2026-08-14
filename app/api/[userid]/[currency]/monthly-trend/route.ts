import type { NextRequest } from "next/server";
import {
  getDeactivationDates,
  getSubscriptionsForTrend,
} from "@/lib/queries/monthly-trend";
import type { FrankfurterRatesResponse } from "@/types/frankfurter";
import type { RouteContext } from "@/types/route-context";

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

type TrendSubscription = {
  id: string;
  price: string;
  currency: string;
  billingCycle: string;
  billingDay: number;
  billingMonth: number | null;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
};

/** Medianoche del día — todas las comparaciones son a nivel día, no timestamp. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Fecha en que la suscripción dejó de existir, o `null` si sigue activa.
 * Preferimos el evento `deleted` del audit log; `updatedAt` sólo es fallback
 * para datos viejos sin evento (es impreciso: cualquier edición lo mueve).
 */
function getDeactivationDate(
  sub: TrendSubscription,
  deactivations: Map<string, Date>,
): Date | null {
  if (sub.active) return null;
  return deactivations.get(sub.id) ?? sub.updatedAt;
}

/**
 * ¿La suscripción seguía viva al cerrar el mes? Se usa sólo para el conteo del
 * tooltip — el monto se decide con la fecha de cobro (ver `getChargeDate`).
 *
 * Medir al cierre (y no "en algún momento del mes") hace que el mes en curso
 * coincida con el contador de suscripciones activas del encabezado.
 */
function wasActiveAtMonthEnd(
  sub: TrendSubscription,
  deactivatedAt: Date | null,
  monthEnd: Date,
): boolean {
  // Not yet created
  if (startOfDay(sub.createdAt) > monthEnd) return false;

  // Still active — was definitely active in this month
  if (!deactivatedAt) return true;

  return deactivatedAt > monthEnd;
}

/**
 * Fecha exacta del cobro dentro del mes objetivo, o `null` si ese mes no hay
 * cobro para esta suscripción.
 *
 * - Mensuales: cobran el `billingDay` de cada mes (clamp al último día).
 * - Anuales: sólo cobran en su `billingMonth`.
 */
function getChargeDate(
  sub: TrendSubscription,
  targetYear: number,
  targetMonth: number,
): Date | null {
  if (sub.billingCycle === "yearly") {
    const billingMonth = sub.billingMonth
      ? sub.billingMonth - 1 // 1-12 → 0-11
      : new Date(sub.createdAt).getMonth();

    if (billingMonth !== targetMonth) return null;
  }

  const lastDay = new Date(targetYear, targetMonth + 1, 0).getDate();
  const day = Math.min(Math.max(sub.billingDay || 1, 1), lastDay);

  return new Date(targetYear, targetMonth, day);
}

/**
 * ¿Ese cobro realmente ocurrió? Debe caer dentro de la vida de la suscripción:
 * después de darla de alta y no después de darla de baja.
 *
 * Esto es lo que evita que una sub cancelada el día 1 siga sumando el mes
 * completo cuando su cobro caía el día 8.
 */
function chargeHappened(
  chargeDate: Date,
  sub: TrendSubscription,
  deactivatedAt: Date | null,
): boolean {
  if (chargeDate < startOfDay(sub.createdAt)) return false;
  if (deactivatedAt && chargeDate > startOfDay(deactivatedAt)) return false;
  return true;
}

/** Precio de la suscripción convertido a la moneda objetivo. */
function convertPrice(
  sub: TrendSubscription,
  targetCurrency: string,
  rates: FrankfurterRatesResponse["rates"],
): number | null {
  const price = Number.parseFloat(String(sub.price)) || 0;
  const subCurrency = String(sub.currency).toUpperCase();

  if (subCurrency === targetCurrency) return price;

  const rate = rates?.[subCurrency as keyof typeof rates];
  if (!rate || rate <= 0) return null;

  return price / rate;
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

  const [subscriptions, deactivations] = await Promise.all([
    getSubscriptionsForTrend(userid),
    getDeactivationDates(userid),
  ]);

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

    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    let monthlyAmount = 0;
    let activeCount = 0;

    for (const sub of subscriptions) {
      const deactivatedAt = getDeactivationDate(sub, deactivations);

      const chargeDate = getChargeDate(sub, targetYear, targetMonth);
      const charged =
        chargeDate !== null && chargeHappened(chargeDate, sub, deactivatedAt);
      const aliveAtEnd = wasActiveAtMonthEnd(sub, deactivatedAt, monthEnd);

      // Ni cobró ni existía al cierre → ese mes no aporta nada.
      if (!charged && !aliveAtEnd) continue;

      const price = convertPrice(sub, targetCurrency, ratesData.rates);

      if (price === null) {
        missingRates.add(String(sub.currency).toUpperCase());
        skippedSubs.add(sub.id);
        continue;
      }

      activeCount++;
      if (charged) monthlyAmount += price;
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
