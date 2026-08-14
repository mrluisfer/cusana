import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { subscriptionEvents, subscriptions } from "../schema";

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
      id: true,
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

/**
 * Fecha real en que cada suscripción fue dada de baja, tomada del audit log.
 *
 * `subscriptions.updatedAt` NO sirve como proxy: cualquier edición (renombrar,
 * cambiar precio) lo reescribe, así que una sub inactiva editada meses después
 * de cancelarse aparecería como si hubiera seguido cobrando. El evento
 * `deleted` sí es inmutable.
 *
 * Devuelve el evento `deleted` más reciente por suscripción (si se reactivó y
 * volvió a cancelarse, gana la última baja).
 */
export async function getDeactivationDates(
  userId: string,
): Promise<Map<string, Date>> {
  const rows = await db
    .select({
      subscriptionId: subscriptionEvents.subscriptionId,
      createdAt: subscriptionEvents.createdAt,
    })
    .from(subscriptionEvents)
    .where(
      and(
        eq(subscriptionEvents.userId, userId),
        eq(subscriptionEvents.eventType, "deleted"),
      ),
    );

  const bySubscription = new Map<string, Date>();

  for (const row of rows) {
    if (!row.subscriptionId) continue;
    const previous = bySubscription.get(row.subscriptionId);
    if (!previous || row.createdAt > previous) {
      bySubscription.set(row.subscriptionId, row.createdAt);
    }
  }

  return bySubscription;
}
