// Formateador de moneda
export const formatCurrency = (amount: number | string, currency: string) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericAmount || 0);
};
