/**
 * Helpers para trabajar con "periodos" mensuales representados como el primer
 * día del mes en formato ISO (YYYY-MM-01). Es la forma en que se guardan los
 * presupuestos en DB, de modo que cada mes tiene su propia fila.
 */

/** Primer día del mes actual (hora local) como YYYY-MM-01. */
export function currentPeriod(): string {
  const now = new Date();
  return toPeriod(now.getFullYear(), now.getMonth() + 1);
}

/** Construye un periodo a partir de año y mes (1-12). */
export function toPeriod(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}-01`;
}

/**
 * Normaliza una entrada arbitraria a un periodo válido (YYYY-MM-01).
 * Acepta "YYYY-MM" o "YYYY-MM-DD"; si no es válida, cae al mes actual.
 */
export function normalizePeriod(input: string | null | undefined): string {
  const match = input?.match(/^(\d{4})-(\d{2})/);
  if (match) return `${match[1]}-${match[2]}-01`;
  return currentPeriod();
}
