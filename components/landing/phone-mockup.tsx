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
      <div className="w-70 md:w-[320px] bg-white rounded-[2.5rem] p-3 shadow-2xl shadow-slate-200/80 border border-slate-200/60">
        {/* Phone notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl" />

        {/* Screen content */}
        <div className="bg-slate-50 rounded-[2rem] pt-8 pb-4 px-4 min-h-125">
          {/* Profile card */}
          <div className="bg-white p-4 shadow-sm border border-slate-100 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500" />
                <div>
                  <p className="font-semibold text-sm text-slate-900">
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
          <div className="flex gap-2 mb-4">
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
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Suscripciones activas
              </p>
              <p className="text-xs text-primary font-medium">Ver todo</p>
            </div>

            {mockSubscriptions.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center justify-between bg-white p-3 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <ServiceIcon
                    service={sub.name as keyof typeof ServiceIcon}
                    className="size-9"
                  />
                  <span className="font-medium text-sm text-slate-800 capitalize">
                    {sub.name}
                  </span>
                </div>
                <span className="text-sm text-slate-600 font-medium">
                  {sub.price}
                  <span className="text-slate-400 text-xs">/mes</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-3xl -z-10" />
    </div>
  );
}
