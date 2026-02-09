"use client";

import { defaultFilters, filtersAtom } from "@/atoms";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import * as React from "react";
import { useCallback, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AiChatButton } from "@/components/ai-chat/ai-chat-button";
import { RefetchButton } from "@/components/dashboard/refetch-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FilterIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { AddSubscription } from "./actions/add-subscription";
import { ExportData } from "./actions/export-data";
import { FilterSubscriptions } from "./actions/filter-subscriptions";
import { Separator } from "@/components/ui/separator";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
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
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
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
              Buscar suscripción
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="input-group-url"
                placeholder="Buscar..."
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
          <AiChatButton triggerClassName="text-primary hover:text-white hover:bg-primary hover:shadow-md hover:shadow-primary/50" />
          <Separator
            orientation="vertical"
            className="mx-1 hidden h-6 w-px sm:block"
          />
          <AddSubscription />
        </div>
      </div>

      {/* Active filters indicator */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-xs">
            {table.getFilteredRowModel().rows.length} resultado
            {table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() =>
              setFilters({
                billingCycle: [],
                currency: [],
                active: [],
              })
            }
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs transition-colors"
          >
            <XIcon className="size-3" />
            Limpiar filtros
          </button>
        </div>
      )}
      {/* Tabla - FIX: Removido overflow-hidden, agregado rounded-md */}
      <div className="border-border bg-card/50 rounded-md border backdrop-blur-sm">
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
                    className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
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
                  className="group hover:bg-muted/30 transition-colors"
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
                  <div className="text-muted-foreground flex flex-col items-center gap-2">
                    <span className="text-4xl">🔭</span>
                    <p>No hay suscripciones</p>
                    <p className="text-sm">
                      Agrega tu primera suscripción para comenzar
                    </p>
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
            Mostrando{" "}
            <span className="text-foreground font-medium">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            a{" "}
            <span className="text-foreground font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{" "}
            de{" "}
            <span className="text-foreground font-medium">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            suscripciones
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
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToPreviousPage}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Página anterior</span>
            </Button>

            <div className="mx-2 flex items-center gap-1">
              <span className="text-muted-foreground text-sm">Página</span>
              <span className="text-sm font-medium">
                {table.getState().pagination.pageIndex + 1}
              </span>
              <span className="text-muted-foreground text-sm">de</span>
              <span className="text-sm font-medium">
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
              <span className="sr-only">Página siguiente</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={goToLastPage}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
