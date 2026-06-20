"use client";

import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";

export function DashboardSectionHeader({
  id,
  section,
}: {
  id: string;
  section: "resume" | "detail";
}) {
  const { t } = useTranslation();

  return (
    <header className="mb-5 flex flex-col gap-1">
      <p className="text-primary text-xs font-semibold tracking-wider uppercase">
        {t(`dashboard.${section}.eyebrow`)}
      </p>
      <h2
        id={id}
        className="text-foreground text-xl font-semibold tracking-tight text-balance md:text-2xl"
      >
        {t(`dashboard.${section}.title`)}
      </h2>
      <p className="text-muted-foreground text-sm text-pretty">
        {t(`dashboard.${section}.description`)}
      </p>
    </header>
  );
}

export function SectionFallback() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-border/60 bg-card/40 flex min-h-40 items-center justify-center rounded-2xl border backdrop-blur-xl"
    >
      <Spinner className="text-muted-foreground size-5" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}
