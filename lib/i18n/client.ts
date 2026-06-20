"use client";

import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, defaultNS } from "./resources";
import { defaultLocale, locales, type Locale } from "./settings";

function createI18n(initialLanguage: Locale): I18nInstance {
  const instance = i18next.createInstance();

  instance.use(initReactI18next).init({
    resources,
    defaultNS,
    lng: initialLanguage,
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return instance;
}

let clientInstance: I18nInstance | null = null;

/**
 * Returns an i18next instance for the given initial language.
 *
 * On the server a fresh instance is created per call so concurrent requests
 * with different languages never share state. On the client a single instance
 * is reused. The language is sourced from a cookie read server-side (see the
 * root layout), so server and client render the same language with no flash.
 */
export function getI18n(initialLanguage: Locale): I18nInstance {
  if (typeof window === "undefined") {
    return createI18n(initialLanguage);
  }
  if (!clientInstance) {
    clientInstance = createI18n(initialLanguage);
  }
  return clientInstance;
}
