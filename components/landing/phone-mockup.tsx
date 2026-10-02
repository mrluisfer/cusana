"use client";

import {
  CalendarDaysIcon,
  HouseIcon,
  PieChartIcon,
  PlusIcon,
  RotateCcwIcon,
  SettingsIcon,
  SignalHigh,
  Wifi,
} from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CATEGORICAL_SLOTS } from "@/constants/chart-colors";
import { type ServiceKey, serviceIcons } from "@/constants/icons";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "../dashboard/service-icon";
import { Button } from "../ui/button";

type MockSubscription = {
  service: ServiceKey;
  /** Precio mensual de ejemplo. */
  price: number;
  /** Días hasta la próxima renovación; ordena la lista como "próximos cobros". */
  renewsIn: number;
  /** Color fijo de la paleta categórica, igual que en las gráficas del dashboard. */
  color: string;
};

const BASE_SUBSCRIPTIONS: MockSubscription[] = [
  {
    service: "netflix",
    price: 15.99,
    renewsIn: 2,
    color: CATEGORICAL_SLOTS[0],
  },
  { service: "spotify", price: 9.99, renewsIn: 5, color: CATEGORICAL_SLOTS[1] },
  {
    service: "youtube",
    price: 13.99,
    renewsIn: 12,
    color: CATEGORICAL_SLOTS[2],
  },
  { service: "claude", price: 2.99, renewsIn: 19, color: CATEGORICAL_SLOTS[3] },
  {
    service: "apple_music",
    price: 10.99,
    renewsIn: 23,
    color: CATEGORICAL_SLOTS[4],
  },
  {
    service: "dropbox",
    price: 11.99,
    renewsIn: 27,
    color: CATEGORICAL_SLOTS[5],
  },
];

// La que inserta el botón "Agregar" para mostrar cómo reacciona el resumen.
const DEMO_SUBSCRIPTION: MockSubscription = {
  service: "disney",
  price: 7.99,
  renewsIn: 9,
  color: CATEGORICAL_SLOTS[6],
};

type Period = "month" | "year";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Anima un número hacia `target` cada vez que cambia (cuenta hacia el nuevo
 * total). Con movimiento reducido salta directo al valor final.
 */
function useAnimatedNumber(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = reduceMotion ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export default function PhoneMockup() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const locale = toIntlLocale(language);

  const [period, setPeriod] = useState<Period>("month");
  const [added, setAdded] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [highlighted, setHighlighted] = useState<ServiceKey | null>(null);

  const subscriptions = (
    added ? [...BASE_SUBSCRIPTIONS, DEMO_SUBSCRIPTION] : BASE_SUBSCRIPTIONS
  ).toSorted((a, b) => a.renewsIn - b.renewsIn);

  const multiplier = period === "year" ? 12 : 1;
  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const total = monthlyTotal * multiplier;
  const animatedTotal = useAnimatedNumber(total);

  const money = (amount: number) =>
    `$${amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const [totalWhole, totalCents] = animatedTotal.toFixed(2).split(".");

  const spendLabel = t(
    period === "year"
      ? "landing.phoneMockup.yearlySpend"
      : "landing.phoneMockup.monthlySpend",
  );
  const isDimmed = (service: ServiceKey) =>
    highlighted !== null && highlighted !== service;

  return (
    <figure
      className="relative mx-auto"
      aria-label={t("landing.phoneMockup.ariaLabel")}
    >
      {/* Botones laterales */}
      <div
        aria-hidden="true"
        className="absolute top-28 -left-[2px] h-14 w-[3px] rounded-l-sm bg-zinc-400 dark:bg-zinc-600"
      />
      <div
        aria-hidden="true"
        className="absolute top-46 -left-[2px] h-14 w-[3px] rounded-l-sm bg-zinc-400 dark:bg-zinc-600"
      />
      <div
        aria-hidden="true"
        className="absolute top-36 -right-[2px] h-20 w-[3px] rounded-r-sm bg-zinc-400 dark:bg-zinc-600"
      />

      {/* Marco: canto de titanio fino + bisel negro */}
      <div className="relative w-[280px] rounded-[3.25rem] bg-linear-to-b from-zinc-300 to-zinc-400 p-[2px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45),0_12px_24px_-12px_rgb(0_0_0/0.25)] md:w-[320px] dark:from-zinc-600 dark:to-zinc-700">
        <div className="rounded-[3.15rem] bg-zinc-950 p-[7px]">
          {/* Pantalla con proporción fija de iPhone: agregar o quitar filas
              nunca cambia el tamaño del teléfono (ni mueve el hero). */}
          <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[2.7rem] bg-background text-foreground">
            {/* Barra de estado */}
            <div
              aria-hidden="true"
              className="flex shrink-0 items-center justify-between px-7 pt-3.5 pb-1 text-[11px] font-semibold"
            >
              <span className="tabular-nums">9:41</span>
              <div className="flex items-center gap-1">
                <SignalHigh className="size-3" />
                <Wifi className="size-3" />
                <span className="relative ml-0.5 inline-flex h-2.5 w-5 items-center rounded-[3px] border border-current px-px">
                  <span className="h-1.5 w-[80%] rounded-[1px] bg-current" />
                  <span className="absolute top-1/2 -right-[3px] h-1 w-[2px] -translate-y-1/2 rounded-r-sm bg-current" />
                </span>
              </div>
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2.5 left-1/2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-zinc-950"
            >
              <span className="absolute top-1/2 right-2.5 size-1.5 -translate-y-1/2 rounded-full bg-zinc-800" />
            </div>

            {/* Lo que no cabe se recorta con un desvanecido, como una vista
                con scroll. */}
            <div className="min-h-0 flex-1 space-y-4 overflow-hidden mask-b-from-[calc(100%-2rem)] px-4 pt-4">
              {/* Resumen: total, periodo y reparto del gasto */}
              <section className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">{spendLabel}</p>
                  <div
                    role="group"
                    aria-label={t("landing.phoneMockup.periodLabel")}
                    className="inline-flex rounded-full bg-muted p-0.5"
                  >
                    {(["month", "year"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={period === option}
                        onClick={() => setPeriod(option)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm",
                          focusRing,
                        )}
                      >
                        {t(`landing.phoneMockup.${option}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[2rem] leading-none font-semibold tracking-tight tabular-nums">
                  ${Number(totalWhole).toLocaleString(locale)}
                  <span className="text-lg text-muted-foreground">
                    .{totalCents}
                  </span>
                </p>
                <p className="sr-only" aria-live="polite">
                  {`${spendLabel}: ${money(total)}`}
                </p>

                {/* Un segmento por suscripción, proporcional a su precio */}
                <div
                  aria-hidden="true"
                  className="flex h-2 gap-0.5"
                  onPointerLeave={() => setHighlighted(null)}
                >
                  {subscriptions.map((sub, index) => (
                    <span
                      key={sub.service}
                      onPointerEnter={() => setHighlighted(sub.service)}
                      data-dimmed={isDimmed(sub.service)}
                      className="h-full grow-(--share) basis-0 rounded-full bg-(--color) transition-opacity duration-150 data-[dimmed=true]:opacity-25 motion-safe:[transition:flex-grow_700ms_cubic-bezier(0.22,1,0.36,1)_var(--delay),opacity_150ms_ease] motion-safe:starting:grow-0"
                      style={
                        {
                          "--share": sub.price,
                          "--color": sub.color,
                          "--delay": `${index * 80}ms`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>

                <p className="text-[11px] text-muted-foreground">
                  {t("landing.phoneMockup.active", {
                    count: subscriptions.length,
                  })}
                </p>
              </section>

              {/* Acciones */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={cn("h-9 flex-1 text-xs", focusRing)}
                  onClick={() => setAdded((value) => !value)}
                >
                  {added ? (
                    <RotateCcwIcon className="size-3.5" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="size-3.5" aria-hidden="true" />
                  )}
                  {t(
                    added
                      ? "landing.phoneMockup.undo"
                      : "landing.phoneMockup.add",
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  aria-pressed={showShare}
                  onClick={() => setShowShare((value) => !value)}
                  className={cn(
                    "h-9 flex-1 text-xs aria-pressed:bg-primary/15 aria-pressed:text-primary",
                    focusRing,
                  )}
                >
                  <PieChartIcon className="size-3.5" aria-hidden="true" />
                  {t("landing.phoneMockup.insights")}
                </Button>
              </div>

              {/* Lista agrupada de suscripciones activas */}
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-medium">
                    {t("landing.phoneMockup.activeSubscriptions")}
                  </p>
                  <p className="text-[11px] text-primary">
                    {t("landing.phoneMockup.seeAll")}
                  </p>
                </div>

                <ul
                  className="divide-y divide-border/70 overflow-hidden rounded-2xl border border-border/70 bg-card"
                  onPointerLeave={() => setHighlighted(null)}
                >
                  {subscriptions.map((sub) => (
                    <li
                      key={sub.service}
                      onPointerEnter={() => setHighlighted(sub.service)}
                      data-dimmed={isDimmed(sub.service)}
                      className={cn(
                        "flex items-center gap-2.5 py-2 pr-3 pl-2.5 transition-[opacity,translate] duration-300 data-[dimmed=true]:opacity-45",
                        // Solo la fila que se agrega con el botón entra animada.
                        sub === DEMO_SUBSCRIPTION &&
                          "motion-safe:starting:-translate-y-1 motion-safe:starting:opacity-0",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="h-7 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: sub.color }}
                      />
                      <ServiceIcon service={sub.service} size="xs" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">
                          {serviceIcons[sub.service].label}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground tabular-nums">
                          {showShare
                            ? t("landing.phoneMockup.share", {
                                percent: Math.round(
                                  (sub.price / monthlyTotal) * 100,
                                ),
                              })
                            : t("landing.phoneMockup.renewsIn", {
                                count: sub.renewsIn,
                              })}
                        </p>
                      </div>
                      <span className="text-xs font-semibold tabular-nums">
                        {money(sub.price * multiplier)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Barra de pestañas de la app */}
            <nav
              aria-hidden="true"
              className="flex shrink-0 items-center justify-around border-t border-border/60 px-6 pt-2.5 pb-7"
            >
              <HouseIcon className="size-[18px] text-primary" />
              <CalendarDaysIcon className="size-[18px] text-muted-foreground" />
              <PieChartIcon className="size-[18px] text-muted-foreground" />
              <SettingsIcon className="size-[18px] text-muted-foreground" />
            </nav>

            {/* Indicador de inicio */}
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-1/2 h-1 w-[34%] -translate-x-1/2 rounded-full bg-foreground/80"
            />

            {/* Brillo del cristal */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent dark:from-white/5"
            />
          </div>
        </div>
      </div>

      {/* Resplandor ambiental */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-[4rem] bg-linear-to-br from-primary/20 via-fuchsia-500/10 to-sky-500/15 blur-3xl"
      />
    </figure>
  );
}
