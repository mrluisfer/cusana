import { eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptions } from "../schema";

export async function getResumeTotalByUser(userId: string) {
  return db.query.subscriptions.findMany({
    where: eq(subscriptions.userId, userId),
    columns: {
      price: true,
      currency: true,
      billingCycle: true,
    },
  });
}
