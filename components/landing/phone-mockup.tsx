import React from "react";
import { Button } from "../ui/button";
import { PieChartIcon, PlusIcon } from "lucide-react";
import { ServiceIcon } from "../dashboard/service-icon";

// Datos de suscripciones de ejemplo para el mockup
const mockSubscriptions = [
  { name: "netflix", price: "$15.99" },
  { name: "spotify", price: "$9.99" },
  { name: "claude", price: "$2.99" },
  { name: "youtube", price: "$13.99" },
];

export default function PhoneMockup() {
  return (
    <div className="relative">
      <div className="w-70 rounded-[2.5rem] border border-slate-200/60 bg-white p-3 shadow-2xl shadow-slate-200/80 md:w-[320px]">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* Screen content */}
        <div className="min-h-125 rounded-[2rem] bg-slate-50 px-4 pt-8 pb-4">
          {/* Profile card */}
          <div className="mb-4 border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Luis Alvarez
                  </p>
                  <p className="text-xs text-slate-500">Gasto mensual</p>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900">
                $42<span className="text-sm font-normal">.96</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mb-4 flex gap-2">
            <Button size={"sm"} className="flex-1">
              <PlusIcon className="size-3.5" />
              Agregar
            </Button>
            <Button size={"sm"} className="flex-1" variant={"secondary"}>
              <PieChartIcon className="size-3.5" />
              Insights
            </Button>
          </div>

          {/* Subscriptions list */}
          <div className="space-y-2">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Suscripciones activas
              </p>
              <p className="text-primary text-xs font-medium">Ver todo</p>
            </div>

            {mockSubscriptions.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center justify-between border border-slate-100 bg-white p-3"
              >
                <div className="flex items-center gap-3">
                  <ServiceIcon
                    service={sub.name as keyof typeof ServiceIcon}
                    className="size-9"
                  />
                  <span className="text-sm font-medium text-slate-800 capitalize">
                    {sub.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {sub.price}
                  <span className="text-xs text-slate-400">/mes</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-linear-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
    </div>
  );
}
