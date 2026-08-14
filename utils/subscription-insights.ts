import type { CategoryKey } from "@/constants/chart-colors";
import {
  type ServiceCategory,
  type ServiceKey,
  serviceIcons,
} from "@/constants/icons";
import type { Subscription } from "@/lib/schema";
import type { FrankfurterRates } from "@/types/frankfurter";

// Los colores viven en `@/constants/chart-colors` — ver CATEGORY_COLORS.
export type { CategoryKey };

export function getServiceCategory(platform: string): CategoryKey {
  const service = serviceIcons[platform as ServiceKey] as
    | { category?: ServiceCategory }
    | undefined;
  return service?.category ?? "other";
}

/** Normalizes a subscription's price to a monthly amount in its ORIGINAL currency. */
export function getMonthlyAmount(sub: Subscription): number {
  const price = Number.parseFloat(String(sub.price)) || 0;
  return sub.billingCycle === "yearly" ? price / 12 : price;
}

/**
 * Converts an amount from one currency to the target.
 * `rates` is the Frankfurter map for base = target (i.e. 1 target = rate[FROM] of FROM).
 * Returns null when the rate is missing so callers can flag/skip it.
 */
export function convertToTarget(
  amount: number,
  from: string,
  target: string,
  rates: FrankfurterRates | undefined,
): number | null {
  const f = from.toUpperCase();
  const t = target.toUpperCase();
  if (f === t) return amount;
  const rate = rates?.[f as keyof FrankfurterRates];
  if (!rate || rate <= 0) return null;
  return amount / rate;
}

const isActive = (sub: Subscription) => sub.active !== false;

export type CategoryDatum = {
  category: CategoryKey;
  total: number; // monthly, converted to target currency
  count: number; // number of active subscriptions
  platforms: number; // distinct platforms in this category
  percent: number;
};

export type CategoryBreakdown = {
  categories: CategoryDatum[];
  total: number;
  missingRates: string[];
  skippedCount: number;
};

/**
 * Aggregates ACTIVE subscriptions by category, normalized to monthly and
 * converted to `target`. Shared by the donut chart and the insights card.
 */
export function computeCategoryBreakdown(
  subscriptions: Subscription[] | undefined,
  target: string,
  rates: FrankfurterRates | undefined,
): CategoryBreakdown {
  if (!subscriptions || !rates) {
    return { categories: [], total: 0, missingRates: [], skippedCount: 0 };
  }

  const missing = new Set<string>();
  let skipped = 0;
  const acc = new Map<
    CategoryKey,
    { total: number; count: number; platforms: Set<string> }
  >();

  for (const sub of subscriptions) {
    if (!isActive(sub)) continue;

    const converted = convertToTarget(
      getMonthlyAmount(sub),
      String(sub.currency),
      target,
      rates,
    );
    if (converted === null) {
      missing.add(String(sub.currency).toUpperCase());
      skipped++;
      continue;
    }

    const category = getServiceCategory(sub.platform);
    const entry = acc.get(category) ?? {
      total: 0,
      count: 0,
      platforms: new Set<string>(),
    };
    entry.total += converted;
    entry.count += 1;
    entry.platforms.add(sub.platform);
    acc.set(category, entry);
  }

  const total = [...acc.values()].reduce((sum, e) => sum + e.total, 0);

  const categories: CategoryDatum[] = [...acc.entries()]
    .map(([category, e]) => ({
      category,
      total: e.total,
      count: e.count,
      platforms: e.platforms.size,
      percent: total > 0 ? (e.total / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  return {
    categories,
    total,
    missingRates: [...missing],
    skippedCount: skipped,
  };
}

/**
 * Deja las `max` categorías más grandes y pliega la cola en "Otros".
 *
 * La paleta categórica solo puede separar 8 marcas a la vez; más allá de eso
 * los colores dejan de distinguirse y la gráfica miente. Plegar la cola es la
 * salida correcta — no inventar hues nuevos.
 *
 * Si la cola es una sola categoría no se pliega: sustituir su nombre por
 * "Otros" pierde información sin ganar nada.
 */
export function foldToTopCategories(
  categories: CategoryDatum[],
  max: number,
): CategoryDatum[] {
  if (categories.length <= max + 1) return categories;

  const head = categories.slice(0, max);
  const tail = categories.slice(max);

  const folded: CategoryDatum = {
    category: "other",
    total: tail.reduce((sum, c) => sum + c.total, 0),
    count: tail.reduce((sum, c) => sum + c.count, 0),
    platforms: tail.reduce((sum, c) => sum + c.platforms, 0),
    percent: tail.reduce((sum, c) => sum + c.percent, 0),
  };

  // La cola puede traer ya un "other" propio; el reduce de arriba lo absorbe.
  const existing = head.findIndex((c) => c.category === "other");
  if (existing >= 0) {
    const merged = head[existing];
    head[existing] = {
      ...merged,
      total: merged.total + folded.total,
      count: merged.count + folded.count,
      platforms: merged.platforms + folded.platforms,
      percent: merged.percent + folded.percent,
    };
    return head.sort((a, b) => b.total - a.total);
  }

  return [...head, folded];
}

/**
 * Builds a compact, language-agnostic snapshot of the user's subscriptions for
 * the AI assistant. Totals are reported per original currency (no FX needed) so
 * the model has accurate figures regardless of exchange-rate availability.
 */
export function buildAiSubscriptionContext(
  subscriptions: Subscription[] | undefined,
): string | null {
  if (!subscriptions || subscriptions.length === 0) return null;

  const active = subscriptions.filter(isActive);
  const inactive = subscriptions.length - active.length;
  const monthlyCount = active.filter(
    (s) => s.billingCycle === "monthly",
  ).length;
  const yearlyCount = active.filter((s) => s.billingCycle === "yearly").length;

  // Monthly-equivalent totals grouped by original currency.
  const perCurrency = new Map<string, number>();
  for (const sub of active) {
    const cur = String(sub.currency).toUpperCase();
    perCurrency.set(cur, (perCurrency.get(cur) ?? 0) + getMonthlyAmount(sub));
  }
  const totalsLine = [...perCurrency.entries()]
    .map(([cur, amount]) => `${amount.toFixed(2)} ${cur}/mes`)
    .join("; ");

  // Active count per category.
  const perCategory = new Map<CategoryKey, number>();
  for (const sub of active) {
    const cat = getServiceCategory(sub.platform);
    perCategory.set(cat, (perCategory.get(cat) ?? 0) + 1);
  }
  const categoryLine = [...perCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(", ");

  const list = subscriptions
    .map((sub) => {
      const monthly = getMonthlyAmount(sub).toFixed(2);
      const state = isActive(sub) ? "activa" : "inactiva";
      return `- ${sub.name} (${sub.platform}, ${getServiceCategory(sub.platform)}): ${sub.price} ${sub.currency} ${sub.billingCycle}, día ${sub.billingDay}, ~${monthly} ${sub.currency}/mes, ${state}`;
    })
    .join("\n");

  return [
    "DATOS REALES DEL USUARIO (sus suscripciones actuales). Úsalos para dar respuestas concretas y personalizadas:",
    `Resumen: ${active.length} activas (${monthlyCount} mensuales, ${yearlyCount} anuales), ${inactive} inactivas.`,
    totalsLine ? `Gasto mensual por moneda: ${totalsLine}.` : "",
    categoryLine ? `Por categoría (activas): ${categoryLine}.` : "",
    "Lista completa:",
    list,
  ]
    .filter(Boolean)
    .join("\n");
}
