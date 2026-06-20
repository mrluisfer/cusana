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

/**
 * Calculates the next billing date based on cycle type.
 *
 * - Monthly: next occurrence of `billingDay` (this month or next).
 * - Yearly: same month as `createdAt`, same `billingDay`, next occurrence.
 */
export function getNextBillingDateFull({
  billingDay,
  billingCycle,
  createdAt,
  billingMonth,
}: BillingDateOptions): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (billingCycle === "yearly") {
    // Use explicit billingMonth (1-12) if provided, otherwise fallback to createdAt month
    const resolvedMonth = billingMonth
      ? billingMonth - 1 // Convert 1-12 to 0-11
      : new Date(createdAt).getMonth();

    // This year's anniversary
    let nextDate = new Date(currentYear, resolvedMonth, billingDay);

    // If it already passed this year, go to next year
    if (nextDate.getTime() < today.getTime()) {
      nextDate = new Date(currentYear + 1, resolvedMonth, billingDay);
    }

    return nextDate;
  }

  // Monthly
  if (currentDay >= billingDay) {
    return new Date(currentYear, currentMonth + 1, billingDay);
  }
  return new Date(currentYear, currentMonth, billingDay);
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
