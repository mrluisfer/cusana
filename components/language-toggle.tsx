"use client";

import { useLanguage } from "@/lib/i18n/use-language";
import { locales, localeLabels } from "@/lib/i18n/settings";
import { cn } from "@/lib/utils";
import { CheckIcon, LanguagesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function LanguageToggle({
  variant = "ghost",
}: {
  variant?: "ghost" | "outline";
}) {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language.label")}
        className={cn(buttonVariants({ variant, size: "icon" }))}
      >
        <LanguagesIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => setLanguage(locale)}>
            <span className="flex-1">{localeLabels[locale]}</span>
            {language === locale && <CheckIcon className="ml-2 size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
