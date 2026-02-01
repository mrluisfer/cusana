// Calcular próxima fecha de cobro
export const getNextBillingDate = (billingDay: number): string => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let nextDate: Date;
  if (currentDay >= billingDay) {
    nextDate = new Date(currentYear, currentMonth + 1, billingDay);
  } else {
    nextDate = new Date(currentYear, currentMonth, billingDay);
  }

  const daysUntil = Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntil === 0) return "Hoy";
  if (daysUntil === 1) return "Mañana";
  if (daysUntil <= 7) return `En ${daysUntil} días`;

  return nextDate.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
};
