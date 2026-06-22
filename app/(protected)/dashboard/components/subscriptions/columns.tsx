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
import { useLanguage } from "@/lib/i18n/use-language";
import { formatCurrency } from "@/utils/format-currency";
import {
  getDaysUntilNextBilling,
  getNextBillingDate,
  getNextBillingDateFull,
} from "@/utils/get-next-billing-date";
import { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  billingMonth?: number | null;
  active: boolean;
  createdAt: string | Date;
  nextBillingDate?: Date;
};

// Componente de acciones con modales integrados
function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const { t } = useTranslation();
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
            <Button variant="outline" className="size-8 p-0">
              <span className="sr-only">
                {t("dashboard.rowActions.openMenu")}
              </span>
              <MoreHorizontal className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {t("dashboard.rowActions.actions")}
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            {t("dashboard.rowActions.edit")}
          </DropdownMenuItem>
          {hasSiteUrl && (
            <DropdownMenuItem onClick={onOpenSite}>
              <ExternalLink className="mr-2 size-4" />
              {t("dashboard.rowActions.openSite")}
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            {t("dashboard.rowActions.delete")}
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

export function useSubscriptionColumns(): ColumnDef<Subscription>[] {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return useMemo<ColumnDef<Subscription>[]>(
    () => [
      // Columna: Servicio (icono + nombre)
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("dashboard.columns.service")}
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
          <DataTableColumnHeader
            column={column}
            title={t("dashboard.columns.price")}
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-base font-semibold tabular-nums">
                {formatCurrency(row.original.price, row.original.currency)}
              </span>
              <Badge variant="default" className="font-mono">
                {row.original.currency}
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs">
              {row.original.billingCycle === "monthly"
                ? t("dashboard.billing.perMonthShort")
                : t("dashboard.billing.perYearShort")}
            </span>
          </div>
        ),
      },

      // Columna: Ciclo de facturación
      {
        accessorKey: "billingCycle",
        header: t("dashboard.columns.cycle"),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.billingCycle === "monthly" ? "default" : "outline"
            }
            className="capitalize"
          >
            {row.original.billingCycle === "monthly"
              ? t("dashboard.billing.monthly")
              : t("dashboard.billing.yearly")}
          </Badge>
        ),
      },

      // Columna: Próximo cobro
      {
        id: "nextBilling",
        // Sort by the real next billing date (timestamp), not the day-of-month,
        // so June 2026 correctly precedes January 2027.
        accessorFn: (row) =>
          getNextBillingDateFull({
            billingDay: row.billingDay,
            billingCycle: row.billingCycle,
            createdAt: row.createdAt,
            billingMonth: row.billingMonth,
          }).getTime(),
        sortingFn: "basic",
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <DataTableColumnHeader
              column={column}
              title={t("dashboard.columns.nextCharge")}
            />
          </div>
        ),
        cell: ({ row }) => {
          const options = {
            billingDay: row.original.billingDay,
            billingCycle: row.original.billingCycle,
            createdAt: row.original.createdAt,
            billingMonth: row.original.billingMonth,
          };
          const nextBilling = getNextBillingDate(options, language);
          const isUrgent = getDaysUntilNextBilling(options) <= 7;

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
        header: () => (
          <span className="sr-only">{t("dashboard.columns.actions")}</span>
        ),
        cell: ({ row }) => <SubscriptionActions subscription={row.original} />,
      },
    ],
    [t, language],
  );
}
