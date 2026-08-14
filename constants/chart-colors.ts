import type { ServiceCategory } from "./icons";

/**
 * Fuente única de los colores que usan las gráficas del dashboard.
 * Cambiar un valor aquí lo cambia en TODAS: dona, barras, tooltips, leyendas
 * y badges de estado. No hardcodees colores en los componentes.
 */

// ─── Series categóricas ───────────────────────────────────────────────

/** Categoría de gráfica: las del catálogo + "other" para lo que no encaja. */
export type CategoryKey = ServiceCategory | "other";

/**
 * Slots categóricos, en orden fijo. Se asignan en secuencia y NUNCA se ciclan:
 * el orden es el mecanismo que garantiza la separación entre daltonismos, no
 * es decorativo. Los valores viven en `app/globals.css` (`--viz-slot-*`) para
 * que cada slot tenga su paso propio en claro y en oscuro.
 *
 * Máximo 8 series en pantalla. La 9ª no inventa un color nuevo: se pliega a
 * "Otros" — ver `MAX_CHART_SLICES` y `foldToTopCategories`.
 */
export const CATEGORICAL_SLOTS = [
  "var(--viz-slot-1)",
  "var(--viz-slot-2)",
  "var(--viz-slot-3)",
  "var(--viz-slot-4)",
  "var(--viz-slot-5)",
  "var(--viz-slot-6)",
  "var(--viz-slot-7)",
  "var(--viz-slot-8)",
] as const;

/** "Otros" no es una serie sino el cajón de sastre: neutro reservado. */
export const OTHER_SERIES_COLOR = "var(--viz-other)";

/**
 * Cuántas categorías se dibujan con color propio antes de plegar el resto.
 * 7 + "Otros" = 8 marcas en pantalla, el máximo que la paleta puede separar.
 */
export const MAX_CHART_SLICES = 7;

/** Color de la serie i-ésima. `other` siempre lleva el neutro reservado. */
export function seriesColor(index: number, category?: CategoryKey): string {
  if (category === "other") return OTHER_SERIES_COLOR;
  return CATEGORICAL_SLOTS[index % CATEGORICAL_SLOTS.length];
}

/** Para plataformas que no tienen color de marca en el catálogo de iconos. */
export const FALLBACK_SERIES_COLOR = "var(--viz-other)";

// ─── Estados ──────────────────────────────────────────────────────────

/**
 * Estados compartidos entre presupuesto, insights y avisos de tipo de cambio.
 * - `over`    — se pasó del límite
 * - `warning` — cerca del límite / dato parcial o excluido
 * - `ok`      — dentro de lo esperado
 * - `neutral` — sin dato con qué comparar
 * - `info`    — informativo, sin juicio de valor
 */
export type ChartStatus = "over" | "warning" | "ok" | "neutral" | "info";

type StatusClasses = {
  /** Relleno de una barra. */
  bar: string;
  /** Relleno del indicador de un `<Progress />`. */
  progress: string;
  /** Texto suelto (avisos, etiquetas). */
  text: string;
  /** Chip/badge: fondo tenue + texto. */
  tone: string;
};

/**
 * Las clases se escriben completas a propósito: Tailwind escanea este archivo
 * y solo genera el CSS de los literales que encuentra, así que no se pueden
 * componer por concatenación.
 */
export const STATUS_CLASSES: Record<ChartStatus, StatusClasses> = {
  over: {
    bar: "bg-destructive",
    progress: "[&_[data-slot=progress-indicator]]:bg-destructive",
    text: "text-destructive",
    tone: "bg-destructive/10 text-destructive",
  },
  warning: {
    bar: "bg-amber-500",
    progress: "[&_[data-slot=progress-indicator]]:bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  ok: {
    bar: "bg-emerald-500",
    progress: "[&_[data-slot=progress-indicator]]:bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  neutral: {
    bar: "bg-muted-foreground/30",
    progress: "[&_[data-slot=progress-indicator]]:bg-muted-foreground/30",
    text: "text-muted-foreground",
    tone: "bg-muted text-muted-foreground",
  },
  info: {
    bar: "bg-primary",
    progress: "[&_[data-slot=progress-indicator]]:bg-primary",
    text: "text-primary",
    tone: "bg-primary/10 text-primary",
  },
};
