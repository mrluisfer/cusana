"use client";

import { defaultFilters, filtersAtom, SubscriptionFilters } from "@/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { currencyArray, currencySymbols } from "@/constants/currency";
import { useAtom } from "jotai";
import { FilterIcon, XIcon } from "lucide-react";
import { on } from "node:stream";
import { useCallback, useMemo } from "react";

function toggleFilterValue<K extends keyof SubscriptionFilters>(
  filters: SubscriptionFilters,
  key: K,
  value: SubscriptionFilters[K][number],
): SubscriptionFilters {
  const current = filters[key] as SubscriptionFilters[K][number][];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  return { ...filters, [key]: next };
}

type FilterSubscriptionsProps = {
  triggerProps?: React.ComponentProps<typeof Button>;
  onlyIcon?: boolean;
};

export function FilterSubscriptions({
  triggerProps,
  onlyIcon = false,
}: FilterSubscriptionsProps) {
  const [filters, setFilters] = useAtom(filtersAtom);

  const activeFilterCount = useMemo(
    () =>
      filters.billingCycle.length +
      filters.currency.length +
      filters.active.length,
    [filters],
  );

  const onToggleFilter = useCallback(
    <K extends keyof SubscriptionFilters>(
      key: K,
      value: SubscriptionFilters[K][number],
    ) => {
      setFilters((prev) => toggleFilterValue(prev, key, value));
    },
    [setFilters],
  );

  const onClearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="default" {...triggerProps}>
            <FilterIcon />
            {!onlyIcon && "Filtrar"}
            {activeFilterCount > 0 && !onlyIcon && (
              <Badge variant="default" className="ml-1 size-5 p-0 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-64">
        <PopoverHeader>
          <div className="flex items-center justify-between">
            <PopoverTitle>Filtrar suscripciones</PopoverTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={onClearFilters}
              >
                <XIcon className="mr-1 size-3" />
                Limpiar
              </Button>
            )}
          </div>
        </PopoverHeader>

        <Separator />

        {/* Ciclo de facturación */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Ciclo
          </p>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={filters.billingCycle.includes("monthly")}
                onCheckedChange={() =>
                  onToggleFilter("billingCycle", "monthly")
                }
              />
              Mensual
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={filters.billingCycle.includes("yearly")}
                onCheckedChange={() => onToggleFilter("billingCycle", "yearly")}
              />
              Anual
            </Label>
          </div>
        </div>

        <Separator />

        {/* Moneda */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Moneda
          </p>
          <div className="space-y-1.5">
            {currencyArray.map((curr) => (
              <Label key={curr} className="flex items-center gap-2 font-normal">
                <Checkbox
                  checked={filters.currency.includes(curr)}
                  onCheckedChange={() => onToggleFilter("currency", curr)}
                />
                {currencySymbols[curr]} {curr}
              </Label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Estado */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium uppercase">
            Estado
          </p>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={filters.active.includes("active")}
                onCheckedChange={() => onToggleFilter("active", "active")}
              />
              Activas
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <Checkbox
                checked={filters.active.includes("inactive")}
                onCheckedChange={() => onToggleFilter("active", "inactive")}
              />
              Inactivas
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
