"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/language-toggle";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

// El año se calcula una vez al cargar el módulo: leer la fecha en cada render
// es impuro (react/purity).
const CURRENT_YEAR = new Date().getFullYear();

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto min-h-screen max-w-4xl px-4">
      <header className="flex items-center justify-between py-6">
        <Button variant="link" render={<Link href="/" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          {t("legal.home")}
        </Button>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Logo />
        </div>
      </header>

      <main className="pb-16">{children}</main>

      <footer className="border-t border-border py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <nav
            className="flex gap-6"
            aria-label={t("landing.footer.legalLabel")}
          >
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              {t("legal.privacy")}
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              {t("legal.terms")}
            </Link>
          </nav>
          <p>&copy; {CURRENT_YEAR} Cusana</p>
        </div>
      </footer>
    </div>
  );
}
