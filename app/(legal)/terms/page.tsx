import { LegalDocView } from "@/components/legal/legal-doc";
import { defaultLocale, isLocale, languageStorageKey } from "@/lib/i18n/settings";
import type { Metadata } from "next";
import { cookies } from "next/headers";

const meta = {
  es: {
    title: "Términos de Servicio",
    description:
      "Términos y condiciones de uso de la plataforma Cusana para el seguimiento de suscripciones.",
  },
  en: {
    title: "Terms of Service",
    description:
      "Terms and conditions for using the Cusana subscription-tracking platform.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get(languageStorageKey)?.value;
  const locale = isLocale(lang) ? lang : defaultLocale;
  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: { canonical: "/terms" },
  };
}

export default function TermsPage() {
  return <LegalDocView doc="terms" />;
}
