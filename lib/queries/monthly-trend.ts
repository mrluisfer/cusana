import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions } from "../schema";

/**
 * Retrieves subscription data needed to compute monthly trend.
 * Returns price, currency, billingCycle, and createdAt for each subscription.
 * The trend is computed by determining which subscriptions were active
 * in each past month based on their createdAt date.
 */
export async function getSubscriptionsForTrend(userId: string) {
  return db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, userId),
    columns: {
      price: true,
      currency: true,
      billingCycle: true,
      createdAt: true,
    },
  });
}
