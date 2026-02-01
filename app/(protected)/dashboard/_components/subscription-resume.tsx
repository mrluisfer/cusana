import React from "react";
import { subscriptionsExample } from "./subscriptions/table";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon } from "lucide-react";

export default function SubscriptionResume() {
  const totalMonthly = subscriptionsExample.reduce((acc, sub) => {
    if (sub.billingCycle === "monthly") {
      return acc + sub.price;
    }
    return acc + sub.price / 12;
  }, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Mis suscripciones
        </h2>
        <p className="text-muted-foreground">
          {subscriptionsExample.length} suscripciones activas · Gasto mensual:{" "}
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
              minimumFractionDigits: 0,
            }).format(totalMonthly)}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <DownloadIcon className="mr-2 size-4" />
          Exportar
        </Button>
        <Button size="sm">
          <PlusIcon className="mr-2 size-4" />
          Agregar suscripción
        </Button>
      </div>
    </div>
  );
}
