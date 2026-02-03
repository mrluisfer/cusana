"use client";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceKey } from "@/constants/icons";
import { formatCurrency } from "@/utils/format-currency";
import { getNextBillingDate } from "@/utils/get-next-billing-date";
import { ColumnDef } from "@tanstack/react-table";
import {
  Bell,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";

export type Subscription = {
  id: string;
  name: string;
  platform: ServiceKey;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  billingDay: number;
  nextBillingDate?: Date;
};

// Handlers extraídos como funciones puras para evitar closures
function handleEdit(subscriptionId: string) {
  console.log("Edit:", subscriptionId);
}

function handleReminder(subscriptionId: string) {
  console.log("Reminder:", subscriptionId);
}

function handleOpenSite(platform: string) {
  console.log("Open:", platform);
}

function handleDelete(subscriptionId: string) {
  console.log("Delete:", subscriptionId);
}

// Componente de acciones separado para evitar closures en la definición de columnas
function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  // Handlers con useCallback para evitar recreación en cada render
  const onEdit = useCallback(
    () => handleEdit(subscription.id),
    [subscription.id],
  );
  const onReminder = useCallback(
    () => handleReminder(subscription.id),
    [subscription.id],
  );
  const onOpenSite = useCallback(
    () => handleOpenSite(subscription.platform),
    [subscription.platform],
  );
  const onDelete = useCallback(
    () => handleDelete(subscription.id),
    [subscription.id],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReminder}>
          <Bell className="mr-2 size-4" />
          Configurar recordatorio
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOpenSite}>
          <ExternalLink className="mr-2 size-4" />
          Abrir sitio web
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const subscriptionsColumns: ColumnDef<Subscription>[] = [
  // Columna: Servicio (icono + nombre)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Servicio"
        triggerClassName="ml-0"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <ServiceIcon service={row.original.platform} />
        <div className="flex flex-col">
          <span className="text-foreground font-medium">
            {row.original.name}
          </span>
          <span className="text-muted-foreground text-xs capitalize">
            {row.original.platform}
          </span>
        </div>
      </div>
    ),
  },

  // Columna: Precio
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precio" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-foreground font-semibold">
          {formatCurrency(row.original.price, row.original.currency)}
        </span>
        <span className="text-muted-foreground text-xs">
          {row.original.billingCycle === "monthly" ? "/mes" : "/año"}
        </span>
      </div>
    ),
  },

  // Columna: Ciclo de facturación
  {
    accessorKey: "billingCycle",
    header: "Ciclo",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.billingCycle === "monthly" ? "default" : "outline"
        }
        className="capitalize"
      >
        {row.original.billingCycle === "monthly" ? "Mensual" : "Anual"}
      </Badge>
    ),
  },

  // Columna: Próximo cobro
  {
    accessorKey: "billingDay",
    header: () => (
      <div className="flex items-center gap-1.5">
        <Calendar className="size-4" />
        <span>Próximo cobro</span>
      </div>
    ),
    cell: ({ row }) => {
      const nextBilling = getNextBillingDate(row.original.billingDay);
      const isUrgent =
        nextBilling === "Hoy" ||
        nextBilling === "Mañana" ||
        nextBilling.includes("días");

      return (
        <span
          className={`text-sm ${isUrgent ? "font-medium text-amber-600 dark:text-amber-500" : "text-muted-foreground"}`}
        >
          {nextBilling}
        </span>
      );
    },
  },

  // Columna: Acciones - usando componente separado para evitar closures
  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    cell: ({ row }) => <SubscriptionActions subscription={row.original} />,
  },
];
