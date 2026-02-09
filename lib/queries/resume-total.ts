import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions } from "../schema";

export async function getResumeTotalByUser(userId: string) {
  return db.query.subscriptions.findMany({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.active, true),
    ),
    columns: {
      price: true,
      currency: true,
      billingCycle: true,
    },
  });
}
