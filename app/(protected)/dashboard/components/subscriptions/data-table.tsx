"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  type RowData,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { filtersAtom } from "@/atoms";

import { AiChatButton } from "@/components/ai-chat/ai-chat-button";
import { RefetchButton } from "@/components/dashboard/refetch-button";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddSubscription } from "./actions/add-subscription";
import { ExportData } from "./actions/export-data";
import { FilterSubscriptions } from "./actions/filter-subscriptions";
import {
  type SubscriptionTableFeatures,
  subscriptionTableFeatures,
} from "./table-features";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<SubscriptionTableFeatures, TData>[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [filters, setFilters] = useAtom(filtersAtom);

  const filteredData = useMemo(() => {
    const hasFilters =
      filters.billingCycle.length > 0 ||
      filters.currency.length > 0 ||
      filters.active.length > 0;

    if (!hasFilters) return data;

    return data.filter((item) => {
      const row = item as Record<string, unknown>;

      if (
        filters.billingCycle.length > 0 &&
        !filters.billingCycle.includes(row.billingCycle as "monthly" | "yearly")
      ) {
        return false;
      }

      if (
        filters.currency.length > 0 &&
        !filters.currency.includes(
          row.currency as (typeof filters.currency)[number],
        )
      ) {
        return false;
      }

      if (filters.active.length > 0) {
        const isActive = row.active !== false;
        const matchesActive =
          (filters.active.includes("active") && isActive) ||
          (filters.active.includes("inactive") && !isActive);
        if (!matchesActive) return false;
      }

      return true;
    });
  }, [data, filters]);

  // TanStack Table isn't compatible with React Compiler memoization.
  const table = useTable({
    features: subscriptionTableFeatures,
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  // Handlers memorizados para evitar closures innecesarios
  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      table.getColumn("name")?.setFilterValue(event.target.value);
    },
    [table],
  );

  const goToFirstPage = useCallback(() => table.setPageIndex(0), [table]);
  const goToPreviousPage = useCallback(() => table.previousPage(), [table]);
  const goToNextPage = useCallback(() => table.nextPage(), [table]);
  const goToLastPage = useCallback(
    () => table.setPageIndex(table.getPageCount() - 1),
    [table],
  );

  const activeFilterCount =
    filters.billingCycle.length +
    filters.currency.length +
    filters.active.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: Search + Filter */}
        <div className="flex items-end gap-2">
          <Field className="min-w-0 flex-1 sm:w-64 sm:flex-none">
            <FieldLabel htmlFor="input-group-url">
              {t("dashboard.table.searchLabel")}
            </FieldLabel>
            <InputGroup className="bg-card">
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="input-group-url"
                placeholder={t("dashboard.table.searchPlaceholder")}
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={handleFilterChange}
              />
            </InputGroup>
          </Field>
          <FilterSubscriptions
            onlyIcon
            triggerProps={{
              variant: activeFilterCount > 0 ? "default" : "outline",
              size: "icon",
              className: "shrink-0",
            }}
          />
        </div>

        {/* Right: Secondary actions (icon-only) + Primary CTA */}
        <div className="flex items-center gap-1.5">
          <RefetchButton />
          <ExportData />
          <AiChatButton />
          <Separator
            orientation="vertical"
            className="mx-1 hidden h-9 w-px sm:block"
          />
          <AddSubscription />
        </div>
      </div>

      {/* Active filters indicator */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs">
            {t("dashboard.table.results", {
              count: table.getFilteredRowModel().rows.length,
            })}
          </p>
          <button
            type="button"
            onClick={() =>
              setFilters({
                billingCycle: [],
                currency: [],
                active: [],
              })
            }
            className="inline-flex items-center gap-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
          >
            <XIcon className="size-3" />
            {t("dashboard.table.clearFilters")}
          </button>
        </div>
      )}
      {/* Tabla - FIX: Removido overflow-hidden, agregado rounded-md */}
      <div className="rounded-md border border-border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <span className="text-4xl">🔭</span>
                    <p>{t("dashboard.table.emptyTitle")}</p>
                    <p className="text-sm">{t("dashboard.table.emptyHint")}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-muted-foreground text-sm">
            {t("dashboard.table.showing", {
              from:
                table.state.pagination.pageIndex *
                  table.state.pagination.pageSize +
                1,
              to: Math.min(
                (table.state.pagination.pageIndex + 1) *
                  table.state.pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              ),
              total: table.getFilteredRowModel().rows.length,
            })}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToFirstPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="size-4" />
              <span className="sr-only">{t("dashboard.table.firstPage")}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToPreviousPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{t("dashboard.table.prevPage")}</span>
            </Button>

            <div className="mx-2 flex items-center gap-1">
              <span className="text-muted-foreground text-sm">
                {t("dashboard.table.page")}
              </span>
              <span className="font-medium text-sm">
                {table.state.pagination.pageIndex + 1}
              </span>
              <span className="text-muted-foreground text-sm">
                {t("dashboard.table.of")}
              </span>
              <span className="font-medium text-sm">
                {table.getPageCount()}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToNextPage}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">{t("dashboard.table.nextPage")}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToLastPage}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-4" />
              <span className="sr-only">{t("dashboard.table.lastPage")}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
