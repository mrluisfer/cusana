import type { ServiceKey } from "@/constants/icons";
import { PieChartIcon, PlusIcon, SignalHigh, Wifi } from "lucide-react";
import { ServiceIcon } from "../dashboard/service-icon";
import { Button } from "../ui/button";

const mockSubscriptions: { name: ServiceKey; price: string }[] = [
  { name: "netflix", price: "$15.99" },
  { name: "spotify", price: "$9.99" },
  { name: "claude", price: "$2.99" },
  { name: "youtube", price: "$13.99" },
];

export default function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      role="img"
      aria-label="Vista previa de la app Cusana en un iPhone"
    >
      {/* Side buttons */}
      <div
        aria-hidden="true"
        className="absolute top-24 -left-[3px] h-16 w-[3px] rounded-l-sm bg-zinc-800 dark:bg-zinc-900"
      />
      <div
        aria-hidden="true"
        className="absolute top-44 -left-[3px] h-10 w-[3px] rounded-l-sm bg-zinc-800 dark:bg-zinc-900"
      />
      <div
        aria-hidden="true"
        className="absolute top-32 -right-[3px] h-20 w-[3px] rounded-r-sm bg-zinc-800 dark:bg-zinc-900"
      />

      {/* Phone frame (titanium-like gradient) */}
      <div className="relative w-[280px] rounded-[3rem] bg-linear-to-b from-zinc-700 via-zinc-900 to-zinc-800 p-[3px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset] md:w-[320px] dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-700">
        {/* Inner bezel */}
        <div className="relative overflow-hidden rounded-[2.85rem] bg-black p-[3px]">
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[2.65rem] bg-linear-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900">
            {/* Status bar */}
            <div className="relative flex items-center justify-between px-7 pt-3 pb-2 text-[11px] font-semibold text-slate-900 dark:text-zinc-100">
              <span className="tabular-nums">9:41</span>
              <div className="flex items-center gap-1">
                <SignalHigh className="size-3" aria-hidden="true" />
                <Wifi className="size-3" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="relative ml-0.5 inline-flex h-2.5 w-5 items-center rounded-[3px] border border-current px-[1px]"
                >
                  <span className="h-1.5 w-[80%] rounded-[1px] bg-current" />
                  <span className="absolute top-1/2 -right-[3px] h-1 w-[2px] -translate-y-1/2 rounded-r-sm bg-current" />
                </span>
              </div>
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-1/2 z-20 h-7 w-[6.5rem] -translate-x-1/2 rounded-full bg-black ring-1 ring-zinc-800"
            >
              <span className="absolute top-1/2 right-3 size-1.5 -translate-y-1/2 rounded-full bg-zinc-700" />
              <span className="absolute top-1/2 right-3 size-[3px] -translate-y-1/2 rounded-full bg-sky-900/80" />
            </div>

            {/* Screen content */}
            <div className="space-y-3 px-4 pt-3 pb-8">
              {/* Profile / total card */}
              <div className="from-primary/95 to-primary shadow-primary/20 relative overflow-hidden rounded-2xl bg-linear-to-br p-4 shadow-lg">
                <div
                  aria-hidden="true"
                  className="absolute -top-6 -right-6 size-24 rounded-full bg-white/10 blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -left-4 size-20 rounded-full bg-fuchsia-400/20 blur-2xl"
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-linear-to-br from-sky-300 via-violet-300 to-fuchsia-400 ring-2 ring-white/30" />
                    <div>
                      <p className="text-primary-foreground/80 text-[10px] font-medium tracking-wider uppercase">
                        Gasto mensual
                      </p>
                      <p className="text-primary-foreground text-xl leading-tight font-bold">
                        $42
                        <span className="text-sm font-normal opacity-80">
                          .96
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    4 activas
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="h-9 flex-1 text-xs">
                  <PlusIcon className="size-3.5" aria-hidden="true" />
                  Agregar
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-9 flex-1 text-xs"
                >
                  <PieChartIcon className="size-3.5" aria-hidden="true" />
                  Insights
                </Button>
              </div>

              {/* Subscriptions list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase dark:text-zinc-400">
                    Suscripciones activas
                  </p>
                  <p className="text-primary text-[10px] font-medium">
                    Ver todo
                  </p>
                </div>

                {mockSubscriptions.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/80 p-2.5 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80"
                  >
                    <div className="flex items-center gap-2.5">
                      <ServiceIcon service={sub.name} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-900 capitalize dark:text-zinc-100">
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                          Mensual
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums dark:text-zinc-200">
                      {sub.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div
              aria-hidden="true"
              className="absolute bottom-1.5 left-1/2 h-1 w-[35%] -translate-x-1/2 rounded-full bg-slate-900/80 dark:bg-zinc-100/80"
            />

            {/* Screen reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[2.65rem] bg-linear-to-tr from-transparent via-white/[0.03] to-white/[0.08]"
            />
          </div>
        </div>
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="from-primary/25 absolute -inset-8 -z-10 rounded-[4rem] bg-linear-to-br via-fuchsia-500/15 to-sky-500/20 blur-3xl"
      />
    </div>
  );
}
