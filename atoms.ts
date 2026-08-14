import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Currency } from "./constants/currency";

export const currencyAtom = atom<Currency>(Currency.MXN);

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

/**
 * Preferencia de escritorio: abrir el detalle de un día del calendario al
 * pasar el cursor, además del click. Se persiste en localStorage; en el primer
 * render vale `false` y se sincroniza al montar, para no romper la hidratación.
 */
export const calendarHoverPreviewAtom = atomWithStorage(
  "cusana:calendar-hover-preview",
  false,
);
