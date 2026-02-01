// Formateador de moneda
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};
