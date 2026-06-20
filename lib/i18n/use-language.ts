"use client";

import { useTranslation } from "react-i18next";
import {
  defaultLocale,
  isLocale,
  languageStorageKey,
  type Locale,
} from "./settings";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Reads and updates the active language. Persists the choice to a cookie (so
 * the server can read it on the next request) and to localStorage, and keeps
 * <html lang> in sync. This is the single entry point for changing language.
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const language: Locale = isLocale(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : defaultLocale;

  const setLanguage = (next: Locale) => {
    if (next === language) return;
    i18n.changeLanguage(next);
    document.cookie = `${languageStorageKey}=${next};path=/;max-age=${ONE_YEAR};samesite=lax`;
    try {
      localStorage.setItem(languageStorageKey, next);
    } catch {
      // localStorage may be unavailable (private mode); cookie still persists.
    }
    document.documentElement.lang = next;
  };

  return { language, setLanguage };
}
