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
          <span className="font-medium text-foreground">
            {row.original.name}
          </span>
          <span className="text-xs text-muted-foreground capitalize">
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
        <span className="font-semibold text-foreground">
          {formatCurrency(row.original.price, row.original.currency)}
        </span>
        <span className="text-xs text-muted-foreground">
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

  // Columna: Acciones
  // En columns.tsx - columna de acciones

  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    cell: ({ row }) => {
      const subscription = row.original;

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
            {/* Opción 1: Wrap en Group */}
            <DropdownMenuGroup>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("Edit:", subscription.id)}
            >
              <Pencil className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Reminder:", subscription.id)}
            >
              <Bell className="mr-2 size-4" />
              Configurar recordatorio
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Open:", subscription.platform)}
            >
              <ExternalLink className="mr-2 size-4" />
              Abrir sitio web
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("Delete:", subscription.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
