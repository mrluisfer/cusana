import type { BillingCycle } from "@/constants/billing-cycle";
import { toIntlLocale } from "@/lib/i18n/format";
import { defaultLocale, type Locale } from "@/lib/i18n/settings";

const relativeLabels: Record<
  Locale,
  { today: string; tomorrow: string; inDays: (n: number) => string }
> = {
  es: {
    today: "Hoy",
    tomorrow: "Mañana",
    inDays: (n) => `En ${n} días`,
  },
  en: {
    today: "Today",
    tomorrow: "Tomorrow",
    inDays: (n) => `In ${n} days`,
  },
};

interface BillingDateOptions {
  billingDay: number;
  billingCycle: BillingCycle;
  createdAt: string | Date;
  billingMonth?: number | null;
}

/** Local calendar date as YYYY-MM-DD (avoids the UTC shift of toISOString). */
export function toISODate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Date of `billingDay` in a month, clamped to the month's length so a day 31
 * subscription bills on Nov 30 instead of rolling over to Dec 1.
 */
function clampedDate(year: number, monthIndex: number, billingDay: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(billingDay, daysInMonth));
}

/** Month (0-11) a yearly subscription bills in. */
function resolveYearlyMonth(
  billingMonth: number | null | undefined,
  createdAt: string | Date,
) {
  // Use explicit billingMonth (1-12) if provided, otherwise fallback to createdAt month
  return billingMonth ? billingMonth - 1 : new Date(createdAt).getMonth();
}

/** Billing date within a month (0-11), or null if the subscription doesn't bill that month. */
export function getBillingDateInMonth(
  options: BillingDateOptions,
  year: number,
  monthIndex: number,
): Date | null {
  if (
    options.billingCycle === "yearly" &&
    resolveYearlyMonth(options.billingMonth, options.createdAt) !== monthIndex
  ) {
    return null;
  }
  return clampedDate(year, monthIndex, options.billingDay);
}

/** Every billing date between `from` and `to` (YYYY-MM-DD, inclusive), oldest first. */
export function getBillingDatesBetween(
  options: BillingDateOptions,
  from: string,
  to: string,
): string[] {
  const [fromYear, fromMonth] = from.split("-").map(Number);
  const [toYear, toMonth] = to.split("-").map(Number);
  const dates: string[] = [];

  for (
    let index = fromYear * 12 + fromMonth - 1;
    index <= toYear * 12 + toMonth - 1;
    index++
  ) {
    const date = getBillingDateInMonth(
      options,
      Math.floor(index / 12),
      index % 12,
    );
    if (!date) continue;
    const iso = toISODate(date);
    if (iso >= from && iso <= to) dates.push(iso);
  }

  return dates;
}

/**
 * Calculates the next billing date based on cycle type.
 *
 * - Monthly: next occurrence of `billingDay` after today (today's charge
 *   counts as done, so it moves to next month).
 * - Yearly: same month as `createdAt`, same `billingDay`, next occurrence
 *   (today included).
 */
export function getNextBillingDateFull({
  billingDay,
  billingCycle,
  createdAt,
  billingMonth,
}: BillingDateOptions): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (billingCycle === "yearly") {
    const resolvedMonth = resolveYearlyMonth(billingMonth, createdAt);

    // This year's anniversary; if it already passed, next year's
    const thisYear = clampedDate(currentYear, resolvedMonth, billingDay);
    return thisYear.getTime() < today.getTime()
      ? clampedDate(currentYear + 1, resolvedMonth, billingDay)
      : thisYear;
  }

  // Monthly
  const thisMonth = clampedDate(currentYear, currentMonth, billingDay);
  return thisMonth.getTime() <= today.getTime()
    ? clampedDate(currentYear, currentMonth + 1, billingDay)
    : thisMonth;
}

/**
 * Returns a human-readable string for the next billing date.
 * Supports both monthly and yearly cycles.
 */
export function getNextBillingDate(
  options: BillingDateOptions,
  locale: Locale = defaultLocale,
): string {
  const nextDate = getNextBillingDateFull(options);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntil = Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const labels = relativeLabels[locale] ?? relativeLabels[defaultLocale];
  if (daysUntil === 0) return labels.today;
  if (daysUntil === 1) return labels.tomorrow;
  if (daysUntil <= 7) return labels.inDays(daysUntil);

  // For yearly subs or far-away dates, include the year if different
  const showYear = nextDate.getFullYear() !== today.getFullYear();

  return nextDate.toLocaleDateString(toIntlLocale(locale), {
    day: "numeric",
    month: "short",
    ...(showYear && { year: "numeric" }),
  });
}

/** Days until the next billing date (0 = today). Useful for urgency styling. */
export function getDaysUntilNextBilling(options: BillingDateOptions): number {
  const nextDate = getNextBillingDateFull(options);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

/**
 * @deprecated Use `getNextBillingDate({ billingDay, billingCycle, createdAt })` instead.
 * Legacy function that assumes monthly cycle.
 */
export const getNextBillingDateLegacy = (billingDay: number): string => {
  return getNextBillingDate({
    billingDay,
    billingCycle: "monthly",
    createdAt: new Date(),
  });
};
