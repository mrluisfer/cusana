import type { BillingCycle } from "@/constants/billing-cycle";

interface BillingDateOptions {
  billingDay: number;
  billingCycle: BillingCycle;
  createdAt: string | Date;
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
}: BillingDateOptions): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (billingCycle === "yearly") {
    const created = new Date(createdAt);
    const billingMonth = created.getMonth();

    // This year's anniversary
    let nextDate = new Date(currentYear, billingMonth, billingDay);

    // If it already passed this year, go to next year
    if (nextDate.getTime() < today.getTime()) {
      nextDate = new Date(currentYear + 1, billingMonth, billingDay);
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
export function getNextBillingDate(options: BillingDateOptions): string {
  const nextDate = getNextBillingDateFull(options);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntil = Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntil === 0) return "Hoy";
  if (daysUntil === 1) return "Mañana";
  if (daysUntil <= 7) return `En ${daysUntil} días`;

  // For yearly subs or far-away dates, include the year if different
  const showYear = nextDate.getFullYear() !== today.getFullYear();

  return nextDate.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    ...(showYear && { year: "numeric" }),
  });
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
