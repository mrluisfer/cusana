"use client";

import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";

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
      <p className="font-semibold text-primary text-xs uppercase tracking-wider">
        {t(`dashboard.${section}.eyebrow`)}
      </p>
      <h2
        id={id}
        className="text-balance font-semibold text-foreground text-xl tracking-tight md:text-2xl"
      >
        {t(`dashboard.${section}.title`)}
      </h2>
      <p className="text-pretty text-muted-foreground text-sm">
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
      className="flex min-h-40 items-center justify-center rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl"
    >
      <Spinner className="size-5 text-muted-foreground" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}
