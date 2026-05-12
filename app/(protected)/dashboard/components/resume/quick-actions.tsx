"use client";

import { currencyAtom, defaultFilters, filtersAtom } from "@/atoms";
import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency, currencyArray, currencySymbols } from "@/constants/currency";
import { useAtom } from "jotai";
import { DollarSignIcon, FilterIcon, XIcon } from "lucide-react";
import { FilterSubscriptions } from "../subscriptions/actions/filter-subscriptions";

export function QuickActions() {
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  const activeFilterCount =
    filters.billingCycle.length +
    filters.currency.length +
    filters.active.length;

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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Configuración</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Item variant="muted" className="p-2.5">
          <ItemMedia variant="icon">
            <DollarSignIcon className="text-primary size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xs">Moneda</ItemTitle>
          </ItemContent>
          <ItemActions>
            <Select
              items={currenciesItems}
              value={currency}
              onValueChange={onCurrencyChange}
            >
              <SelectTrigger className="h-8 w-24 text-xs">
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

        <Item variant="muted" className="p-2.5">
          <ItemMedia variant="icon">
            <FilterIcon className="text-primary size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-xs">Filtros</ItemTitle>
            {activeFilterCount > 0 && (
              <ItemDescription className="text-[11px]">
                {activeFilterCount} activo{activeFilterCount > 1 ? "s" : ""}
              </ItemDescription>
            )}
          </ItemContent>
          <ItemActions className="gap-1">
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpiar filtros"
              >
                <XIcon className="size-3.5" />
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
      </CardContent>
    </Card>
  );
}
