"use client";

import { currencyAtom } from "@/atoms";
import { CardHeaderIcon } from "@/components/card-header-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { AddSubscription } from "../subscriptions/actions/add-subscription";
import { ExportData } from "../subscriptions/actions/export-data";

export function QuickActions() {
  const [currency, setCurrency] = useAtom(currencyAtom);

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
      <CardContent className="space-y-4">
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

        <Separator />

        {/* Acciones adicionales */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Acciones
          </p>
          <div className="grid grid-cols-2 gap-2">
            <AddSubscription />
            <Button variant="outline" size="sm" className="justify-start gap-2">
              <FilterIcon className="h-3 w-3" />
              <span className="text-xs">Filtrar</span>
            </Button>
            <ExportData />
          </div>
        </div>

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
