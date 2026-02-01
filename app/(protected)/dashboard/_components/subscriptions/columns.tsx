"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import {
  ArrowUpDown,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bell,
  ExternalLink,
} from "lucide-react";
import { ServiceKey } from "@/constants/icons";

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

// Formateador de moneda
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

// Calcular próxima fecha de cobro
const getNextBillingDate = (billingDay: number): string => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let nextDate: Date;
  if (currentDay >= billingDay) {
    nextDate = new Date(currentYear, currentMonth + 1, billingDay);
  } else {
    nextDate = new Date(currentYear, currentMonth, billingDay);
  }

  const daysUntil = Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntil === 0) return "Hoy";
  if (daysUntil === 1) return "Mañana";
  if (daysUntil <= 7) return `En ${daysUntil} días`;

  return nextDate.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
};

export const subscriptionsColumns: ColumnDef<Subscription>[] = [
  // Columna: Servicio (icono + nombre)
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Servicio
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
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
      <Button
        variant="ghost"
        className="-ml-4"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Precio
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
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
          row.original.billingCycle === "monthly" ? "secondary" : "outline"
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
