export const monthsArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type Month = (typeof monthsArray)[number];

export const monthLabels: Record<Month, string> = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
};
