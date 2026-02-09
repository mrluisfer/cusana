"use client";

import { currencyAtom, defaultFilters, filtersAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Currency, currencyArray, currencySymbols } from "@/constants/currency";
import { useAtom } from "jotai";
import {
  ChartLineIcon,
  ClockIcon,
  DollarSignIcon,
  FilterIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";
import { useMemo } from "react";
import { FilterSubscriptions } from "../subscriptions/actions/filter-subscriptions";

export function QuickActions() {
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  const activeFilterCount = useMemo(
    () =>
      filters.billingCycle.length +
      filters.currency.length +
      filters.active.length,
    [filters],
  );

  const currenciesItems = currencyArray.map((curr) => ({
    label: curr,
    value: curr,
  }));

  const onCurrencyChange = (value: Currency | null) => {
    if (value) {
      setCurrency(value);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CardHeaderIcon icon={SettingsIcon} />
              Acciones Rápidas
            </CardTitle>
            <CardDescription className="mt-1">
              Controles y configuración
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selector de moneda */}
        <Item variant="muted" className="p-3">
          <ItemMedia variant="icon">
            <DollarSignIcon className="text-primary" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Moneda de visualización</ItemTitle>
            <ItemDescription className="text-xs">
              Tipos de cambio via{" "}
              <Kbd className="text-[10px]">api.frankfurter.dev</Kbd>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Select
              items={currenciesItems}
              value={currency}
              onValueChange={onCurrencyChange}
            >
              <SelectTrigger className="w-25">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Moneda</SelectLabel>
                  {currenciesItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {currencySymbols[item.value]} {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </ItemActions>
        </Item>

        {/* Filtros activos */}
        <Item variant="muted" className="p-3">
          <ItemMedia variant="icon">
            <FilterIcon className="text-primary" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Filtros</ItemTitle>
            <ItemDescription className="text-xs">
              {activeFilterCount > 0
                ? `${activeFilterCount} filtro${activeFilterCount > 1 ? "s" : ""} activo${activeFilterCount > 1 ? "s" : ""}`
                : "Sin filtros aplicados"}
            </ItemDescription>
          </ItemContent>
          <ItemActions className="gap-1">
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpiar filtros"
              >
                <XIcon className="size-4" />
              </button>
            )}
            <FilterSubscriptions
              triggerProps={{
                variant: activeFilterCount > 0 ? "default" : "outline",
                size: "sm",
              }}
            />
          </ItemActions>
        </Item>

        <Separator />

        {/* Info adicional */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Información
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <ClockIcon /> Actualizado hace 5 min
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <ChartLineIcon /> Datos en tiempo real
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
