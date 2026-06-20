import { LegalDocView } from "@/components/legal/legal-doc";
import { defaultLocale, isLocale, languageStorageKey } from "@/lib/i18n/settings";
import type { Metadata } from "next";
import { cookies } from "next/headers";

const meta = {
  es: {
    title: "Política de Privacidad",
    description:
      "Política de privacidad de Cusana. Conoce cómo recopilamos, usamos y protegemos tus datos.",
  },
  en: {
    title: "Privacy Policy",
    description:
      "Cusana's privacy policy. Learn how we collect, use and protect your data.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get(languageStorageKey)?.value;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: { canonical: "/privacy" },
  };
}

export default function PrivacyPage() {
  return <LegalDocView doc="privacy" />;
}
