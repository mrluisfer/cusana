import { db } from "@/lib/db";
import { NewSubscription, subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getSubscriptionsByUser(userId: string) {
  return db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, userId),
    orderBy: (subscriptions, { asc }) => [asc(subscriptions.billingDay)],
  });
}

export async function createSubscription(data: NewSubscription) {
  return db.insert(subscriptions).values(data).returning();
}

export async function deleteSubscription(id: string, userId: string) {
  return db
    .delete(subscriptions)
    .where(eq(subscriptions.id, id) && eq(subscriptions.userId, userId));
}
