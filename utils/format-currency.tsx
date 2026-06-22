// Formateador de moneda
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string) {
  let f = formatterCache.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      // narrowSymbol keeps every currency symbol-prefixed and consistent
      // ($9.99, €9.99) instead of mixing ISO codes ("USD 9.99", "EUR 9.99").
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatterCache.set(currency, f);
  }
  return f;
}

export const formatCurrency = (amount: number | string, currency: string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return getFormatter(currency).format(numericAmount || 0);
};
