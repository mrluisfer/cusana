import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { subscriptionPayments } from "@/lib/schema";
import {
  getBillingDatesBetween,
  toISODate,
} from "@/utils/get-next-billing-date";
import { getSubscriptionById, getSubscriptionsByUser } from "./subscriptions";

/** Cuánto hacia atrás se registran cobros automáticos al sincronizar. */
const MAX_BACKFILL_MONTHS = 24;

export type PaymentStatus = "paid" | "unpaid";

const paymentKey = (subscriptionId: string, dueDate: string) =>
  `${subscriptionId}:${dueDate}`;

/**
 * Registra como pagados (`source: "auto"`) los cobros de las suscripciones
 * activas cuya fecha ya llegó (`dueDate <= today`) y que aún no tienen fila.
 * Solo cuenta desde que se creó la suscripción, y nunca pisa una fila
 * existente: las correcciones manuales siempre ganan.
 *
 * `today` viene del cliente (YYYY-MM-DD) porque el servidor corre en UTC.
 */
export async function syncAutoPayments(userId: string, today: string) {
  const subs = await getSubscriptionsByUser(userId);
  if (subs.length === 0) return;

  const [year, month] = today.split("-").map(Number);
  const windowStart = toISODate(
    new Date(year, month - 1 - MAX_BACKFILL_MONTHS, 1),
  );

  const candidates = subs.flatMap((sub) => {
    const createdOn = toISODate(new Date(sub.createdAt));
    const from = createdOn > windowStart ? createdOn : windowStart;
    return getBillingDatesBetween(sub, from, today).map((dueDate) => ({
      userId,
      subscriptionId: sub.id,
      dueDate,
      status: "paid" as const,
      source: "auto" as const,
      paidOn: dueDate,
      amount: sub.price,
      currency: sub.currency,
    }));
  });
  if (candidates.length === 0) return;

  const existing = await db
    .select({
      subscriptionId: subscriptionPayments.subscriptionId,
      dueDate: subscriptionPayments.dueDate,
    })
    .from(subscriptionPayments)
    .where(
      and(
        eq(subscriptionPayments.userId, userId),
        inArray(
          subscriptionPayments.subscriptionId,
          subs.map((sub) => sub.id),
        ),
        gte(subscriptionPayments.dueDate, windowStart),
      ),
    );

  const recorded = new Set(
    existing.map((row) => paymentKey(row.subscriptionId, row.dueDate)),
  );
  const missing = candidates.filter(
    (row) => !recorded.has(paymentKey(row.subscriptionId, row.dueDate)),
  );
  if (missing.length === 0) return;

  // onConflictDoNothing cubre dos peticiones sincronizando a la vez.
  await db.insert(subscriptionPayments).values(missing).onConflictDoNothing();
}

/** Cobros registrados con fecha entre `from` y `to` (YYYY-MM-DD, inclusive). */
export async function getPaymentsInRange(
  userId: string,
  from: string,
  to: string,
) {
  return db.query.subscriptionPayments.findMany({
    where: and(
      eq(subscriptionPayments.userId, userId),
      gte(subscriptionPayments.dueDate, from),
      lte(subscriptionPayments.dueDate, to),
    ),
    columns: {
      subscriptionId: true,
      dueDate: true,
      status: true,
      source: true,
      paidOn: true,
    },
  });
}

/**
 * Marca manualmente un cobro como pagado o pendiente. Devuelve null si la
 * suscripción no es del usuario o si `dueDate` no es una fecha de cobro suya.
 * El monto se fotografía solo al crear la fila; al corregir una existente se
 * conserva el original.
 */
export async function setPaymentStatus({
  userId,
  subscriptionId,
  dueDate,
  status,
  paidOn,
}: {
  userId: string;
  subscriptionId: string;
  dueDate: string;
  status: PaymentStatus;
  paidOn: string;
}) {
  const sub = await getSubscriptionById(subscriptionId, userId);
  if (!sub) return null;
  if (getBillingDatesBetween(sub, dueDate, dueDate).length === 0) return null;

  const resolvedPaidOn = status === "paid" ? paidOn : null;

  const [row] = await db
    .insert(subscriptionPayments)
    .values({
      userId,
      subscriptionId,
      dueDate,
      status,
      source: "manual",
      paidOn: resolvedPaidOn,
      amount: sub.price,
      currency: sub.currency,
    })
    .onConflictDoUpdate({
      target: [
        subscriptionPayments.subscriptionId,
        subscriptionPayments.dueDate,
      ],
      set: {
        status,
        source: "manual",
        paidOn: resolvedPaidOn,
        updatedAt: new Date(),
      },
    })
    .returning();

  return row ?? null;
}
