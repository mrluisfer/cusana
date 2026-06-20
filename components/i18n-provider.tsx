"use client";

import { getI18n } from "@/lib/i18n/client";
import { defaultLocale, type Locale } from "@/lib/i18n/settings";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

export function I18nProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Locale;
  children: React.ReactNode;
}) {
  const [i18n] = useState(() => getI18n(initialLanguage));

  // Keep <html lang> in sync with any programmatic language change.
  useEffect(() => {
    const sync = (lng: string) => {
      document.documentElement.lang = lng;
    };
    sync(i18n.resolvedLanguage ?? defaultLocale);
    i18n.on("languageChanged", sync);
    return () => {
      i18n.off("languageChanged", sync);
    };
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
