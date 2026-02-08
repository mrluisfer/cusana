import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import {
  type EventMetadata,
  type NewSubscriptionEvent,
  type Subscription,
  type SubscriptionChanges,
  type SubscriptionSnapshot,
  subscriptionEvents,
} from "../schema";

// ─── Helpers ──────────────────────────────────────────────────────────

/** Crea un snapshot del estado actual de una suscripción */
export function createSnapshot(sub: Subscription): SubscriptionSnapshot {
  return {
    name: sub.name,
    platform: sub.platform,
    price: String(sub.price),
    currency: sub.currency,
    billingCycle: sub.billingCycle,
    billingDay: sub.billingDay,
    description: sub.description,
    url: sub.url,
  };
}

/** Compara dos snapshots y retorna los cambios */
export function diffSnapshots(
  before: SubscriptionSnapshot,
  after: SubscriptionSnapshot,
): SubscriptionChanges | null {
  const changes: SubscriptionChanges = {};
  let hasChanges = false;

  for (const key of Object.keys(before) as (keyof SubscriptionSnapshot)[]) {
    const fromVal = before[key] ?? null;
    const toVal = after[key] ?? null;

    if (String(fromVal) !== String(toVal)) {
      changes[key] = {
        from: fromVal as string | number | null,
        to: toVal as string | number | null,
      };
      hasChanges = true;
    }
  }

  return hasChanges ? changes : null;
}

/** Determina el eventType específico basado en los cambios */
export function resolveEventType(
  changes: SubscriptionChanges | null,
): NewSubscriptionEvent["eventType"] {
  if (!changes) return "updated";

  if (changes.price && Object.keys(changes).length === 1) {
    return "price_changed";
  }

  if (changes.billingCycle && Object.keys(changes).length === 1) {
    return "cycle_changed";
  }

  return "updated";
}

// ─── Write Operations ─────────────────────────────────────────────────

/** Registra un evento de creación de suscripción */
export async function logSubscriptionCreated(
  sub: Subscription,
  metadata?: EventMetadata,
) {
  return db.insert(subscriptionEvents).values({
    userId: sub.userId,
    subscriptionId: sub.id,
    eventType: "created",
    snapshot: createSnapshot(sub),
    changes: null,
    metadata: metadata ?? null,
  });
}

/** Registra un evento de actualización de suscripción */
export async function logSubscriptionUpdated(
  before: Subscription,
  after: Subscription,
  metadata?: EventMetadata,
) {
  const beforeSnapshot = createSnapshot(before);
  const afterSnapshot = createSnapshot(after);
  const changes = diffSnapshots(beforeSnapshot, afterSnapshot);

  // Si no hay cambios reales, no registrar evento
  if (!changes) return null;

  const eventType = resolveEventType(changes);

  return db.insert(subscriptionEvents).values({
    userId: after.userId,
    subscriptionId: after.id,
    eventType,
    snapshot: afterSnapshot,
    changes,
    metadata: metadata ?? null,
  });
}

/** Registra un evento de eliminación de suscripción */
export async function logSubscriptionDeleted(
  sub: Subscription,
  metadata?: EventMetadata,
) {
  return db.insert(subscriptionEvents).values({
    userId: sub.userId,
    subscriptionId: sub.id,
    eventType: "deleted",
    snapshot: createSnapshot(sub),
    changes: null,
    metadata: metadata ?? null,
  });
}

// ─── Read Operations ──────────────────────────────────────────────────

/** Obtiene los eventos de un usuario, más recientes primero */
export async function getEventsByUser(userId: string, limit = 50) {
  return db.query.subscriptionEvents.findMany({
    where: eq(subscriptionEvents.userId, userId),
    orderBy: [desc(subscriptionEvents.createdAt)],
    limit,
  });
}

/** Obtiene los eventos de una suscripción específica */
export async function getEventsBySubscription(
  subscriptionId: string,
  limit = 20,
) {
  return db.query.subscriptionEvents.findMany({
    where: eq(subscriptionEvents.subscriptionId, subscriptionId),
    orderBy: [desc(subscriptionEvents.createdAt)],
    limit,
  });
}

/** Obtiene los eventos recientes de un usuario para el activity feed */
export async function getRecentActivity(userId: string, limit = 10) {
  return db.query.subscriptionEvents.findMany({
    where: eq(subscriptionEvents.userId, userId),
    orderBy: [desc(subscriptionEvents.createdAt)],
    limit,
  });
}
