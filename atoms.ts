import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Currency } from "./constants/currency";

export const currencyAtom = atom<Currency>(Currency.MXN);

/**
 * User-defined monthly budget, kept per currency and persisted to localStorage
 * so it survives reloads. Read via `monthlyBudgetAtom[currency]`.
 */
export const monthlyBudgetAtom = atomWithStorage<Record<string, number>>(
  "cusana-monthly-budget",
  {},
);

// AI Chat panel visibility
export const aiChatOpenAtom = atom(false);

// Command palette (⌘K) visibility
export const commandOpenAtom = atom(false);

// Filtros de suscripciones
export type SubscriptionFilters = {
  billingCycle: ("monthly" | "yearly")[];
  currency: Currency[];
  active: ("active" | "inactive")[];
};

export const defaultFilters: SubscriptionFilters = {
  billingCycle: [],
  currency: [],
  active: [],
};

export const filtersAtom = atom<SubscriptionFilters>(defaultFilters);
