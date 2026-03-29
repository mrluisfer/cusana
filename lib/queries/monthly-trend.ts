import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions } from "../schema";

/**
 * Retrieves subscription data needed to compute monthly trend.
 * Includes ALL subscriptions (active and inactive) so the trend
 * accurately reflects historical spending — deactivated subs
 * are counted for the months they were active.
 */
export async function getSubscriptionsForTrend(userId: string) {
  return db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, userId),
    columns: {
      price: true,
      currency: true,
      billingCycle: true,
      billingDay: true,
      billingMonth: true,
      createdAt: true,
      updatedAt: true,
      active: true,
    },
  });
}
