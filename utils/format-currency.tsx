// Formateador de moneda
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: string) {
  let f = formatterCache.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
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
