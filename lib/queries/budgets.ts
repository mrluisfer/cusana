import type { Currency } from "@/constants/currency";
import { and, eq, lt } from "drizzle-orm";
import { db } from "../db";
import { budgets } from "../schema";

/** Presupuesto exacto guardado para un mes concreto. */
export async function getBudgetForPeriod(
  userId: string,
  currency: Currency,
  period: string,
) {
  return db.query.budgets.findFirst({
    where: and(
      eq(budgets.userId, userId),
      eq(budgets.currency, currency),
      eq(budgets.period, period),
    ),
  });
}

/**
 * Último presupuesto guardado ANTES de un mes dado. Se usa para heredar el
 * presupuesto del mes anterior cuando el mes actual aún no tiene uno propio.
 */
export async function getLatestBudgetBefore(
  userId: string,
  currency: Currency,
  period: string,
) {
  return db.query.budgets.findFirst({
    where: and(
      eq(budgets.userId, userId),
      eq(budgets.currency, currency),
      lt(budgets.period, period),
    ),
    orderBy: (budgets, { desc }) => [desc(budgets.period)],
  });
}

/**
 * Crea o actualiza (upsert) el presupuesto de un mes. El índice único
 * (userId, currency, period) garantiza una sola fila por mes.
 */
export async function upsertBudget(
  userId: string,
  currency: Currency,
  period: string,
  amount: number,
) {
  return db
    .insert(budgets)
    .values({ userId, currency, period, amount: String(amount) })
    .onConflictDoUpdate({
      target: [budgets.userId, budgets.currency, budgets.period],
      set: { amount: String(amount), updatedAt: new Date() },
    })
    .returning();
}

/** Histórico de presupuestos por mes (más reciente primero). */
export async function getBudgetHistory(
  userId: string,
  currency: Currency,
  limit = 12,
) {
  return db.query.budgets.findMany({
    where: and(eq(budgets.userId, userId), eq(budgets.currency, currency)),
    orderBy: (budgets, { desc }) => [desc(budgets.period)],
    limit,
    columns: { period: true, amount: true },
  });
}
