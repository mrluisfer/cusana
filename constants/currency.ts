export const Currency = {
  MXN: "MXN",
  USD: "USD",
  EUR: "EUR",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const currencyArray = ["MXN", "USD", "EUR"] as const;

export const currencySymbols: Record<Currency, string> = {
  MXN: "$",
  USD: "$",
  EUR: "€",
};

export const currencyNames: Record<Currency, string> = {
  MXN: "Peso Mexicano",
  USD: "Dólar Estadounidense",
  EUR: "Euro",
};
