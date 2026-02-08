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
import { PLATFORM_URLS } from "@/constants/platform-urls";
import { formatCurrency } from "@/utils/format-currency";
import { getNextBillingDate } from "@/utils/get-next-billing-date";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DeleteSubscription } from "./delete-subscription";
import { EditSubscription } from "./edit-subscription";

export type Subscription = {
  id: string;
  name: string;
  platform: ServiceKey;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  billingDay: number;
  createdAt: string | Date;
  nextBillingDate?: Date;
};

// Componente de acciones con modales integrados
function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onEdit = useCallback(() => setEditOpen(true), []);
  const onDelete = useCallback(() => setDeleteOpen(true), []);

  const onOpenSite = useCallback(() => {
    const url = PLATFORM_URLS[subscription.platform];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, [subscription.platform]);

  const hasSiteUrl = !!PLATFORM_URLS[subscription.platform];

  return (
    <>
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
          {hasSiteUrl && (
            <DropdownMenuItem onClick={onOpenSite}>
              <ExternalLink className="mr-2 size-4" />
              Abrir sitio web
            </DropdownMenuItem>
          )}

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

      <EditSubscription
        subscription={subscription}
        open={editOpen}
        onOpenChangeAction={setEditOpen}
      />
      <DeleteSubscription
        subscription={subscription}
        open={deleteOpen}
        onOpenChangeAction={setDeleteOpen}
      />
    </>
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
      const nextBilling = getNextBillingDate({
        billingDay: row.original.billingDay,
        billingCycle: row.original.billingCycle,
        createdAt: row.original.createdAt,
      });
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
  {
    id: "actions",
    header: () => <span className="sr-only">Acciones</span>,
    cell: ({ row }) => <SubscriptionActions subscription={row.original} />,
  },
];
