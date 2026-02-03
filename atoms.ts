import { atom } from "jotai";
import { Currency } from "./constants/currency";

export const currencyAtom = atom<Currency>(Currency.MXN);
