"use client";

import { currencyAtom } from "@/atoms";
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
import { Currency, currencyArray, currencySymbols } from "@/constants/currency";
import { useAtom } from "jotai";
import { DollarSignIcon } from "lucide-react";

export function ChangeCurrency() {
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
    <Item className="max-w-sm">
      <ItemMedia variant={"icon"}>
        <DollarSignIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Seleccionar moneda</ItemTitle>
        <ItemDescription>
          Los tipos de cambio son proporcionados por{" "}
          <Kbd>api.frankfurter.dev/v1</Kbd>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Select
          items={currenciesItems}
          value={currency}
          onValueChange={onCurrencyChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Currency</SelectLabel>
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
  );
}
