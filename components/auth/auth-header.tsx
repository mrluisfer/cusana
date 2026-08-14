"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../language-toggle";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

export function AuthHeader() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-4 z-40 flex w-full items-center justify-between rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <Button variant="outline" render={<Link href="/" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} aria-hidden="true" />
          <span className="hidden sm:inline">{t("nav.back")}</span>
        </Button>
      </div>
    </header>
  );
}
