import { Currency } from "@/constants/currency";

export type FrankfurterRates = {
  EUR?: number;
  USD?: number;
  MXN?: number;
};

export type FrankfurterRatesResponse = {
  amount: number;
  base: Currency;
  date: string;
  rates: FrankfurterRates;
};
