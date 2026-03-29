import { atom } from "jotai";
import { Currency } from "./constants/currency";

export const currencyAtom = atom<Currency>(Currency.MXN);

// AI Chat panel visibility
export const aiChatOpenAtom = atom(false);

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
