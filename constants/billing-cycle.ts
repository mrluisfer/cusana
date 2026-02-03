export const BillingCycle = {
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle];

export const billingCycleArray = ["monthly", "yearly"] as const;

export const billingCycleLabels: Record<BillingCycle, string> = {
  monthly: "Mensual",
  yearly: "Anual",
};
