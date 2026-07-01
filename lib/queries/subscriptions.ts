import { db } from "@/lib/db";
import { type NewSubscription, subscriptions } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import {
  logSubscriptionCreated,
  logSubscriptionDeleted,
  logSubscriptionReactivated,
  logSubscriptionUpdated,
} from "./subscription-events";

export async function getSubscriptionsByUser(userId: string) {
  return db.query.subscriptions.findMany({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.active, true),
    ),
    orderBy: (subscriptions, { asc }) => [asc(subscriptions.billingDay)],
  });
}

/**
 * Suscripciones inactivas (soft-deleted) de un usuario.
 * Solo se usan como ayuda visual; nunca entran en cálculos de negocio.
 */
export async function getInactiveSubscriptionsByUser(userId: string) {
  return db.query.subscriptions.findMany({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.active, false),
    ),
    orderBy: (subscriptions, { desc }) => [desc(subscriptions.updatedAt)],
  });
}

export async function getSubscriptionById(id: string, userId: string) {
  return db.query.subscriptions.findFirst({
    where: and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)),
  });
}

export async function createSubscription(data: NewSubscription) {
  const result = await db.insert(subscriptions).values(data).returning();

  // Registrar evento de creación
  if (result[0]) {
    await logSubscriptionCreated(result[0], { source: "web" });
  }

  return result;
}

export async function updateSubscription(
  id: string,
  userId: string,
  data: Partial<Omit<NewSubscription, "id" | "userId">>,
) {
  // Capturar estado anterior
  const before = await getSubscriptionById(id, userId);
  if (!before) return null;

  const result = await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  // Registrar evento de actualización
  if (result[0]) {
    await logSubscriptionUpdated(before, result[0], { source: "web" });
  }

  return result;
}

export async function reactivateSubscription(id: string, userId: string) {
  // Solo reactivar suscripciones que estén inactivas
  const before = await getSubscriptionById(id, userId);
  if (!before) return null;

  const result = await db
    .update(subscriptions)
    .set({ active: true, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  // Registrar evento de reactivación
  if (result[0]) {
    await logSubscriptionReactivated(result[0], { source: "web" });
  }

  return result;
}

export async function deleteSubscription(id: string, userId: string) {
  // Capturar estado antes de desactivar
  const before = await getSubscriptionById(id, userId);
  if (!before) return null;

  // Soft delete: marcar como inactiva en vez de eliminar
  const result = await db
    .update(subscriptions)
    .set({ active: false, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();

  // Registrar evento de eliminación
  if (before) {
    await logSubscriptionDeleted(before, { source: "web" });
  }

  return result;
}

/**
 * Eliminación permanente (hard delete): borra el registro de la base de datos.
 * El historial (subscription_events) se conserva como audit log inmutable.
 */
export async function hardDeleteSubscription(id: string, userId: string) {
  const before = await getSubscriptionById(id, userId);
  if (!before) return null;

  return db
    .delete(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();
}
