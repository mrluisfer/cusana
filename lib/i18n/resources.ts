import en from "./locales/en.json";
import es from "./locales/es.json";

export const defaultNS = "translation" as const;

export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const;

export type TranslationResource = typeof es;
