import type { Locale } from "./settings";

/** Maps an app locale to a full BCP-47 tag for Intl number/date formatting. */
export const intlLocale: Record<Locale, string> = {
  es: "es-MX",
  en: "en-US",
};

export function toIntlLocale(locale: Locale): string {
  return intlLocale[locale] ?? intlLocale.es;
}
