"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle({
  variant = "ghost",
}: {
  variant?: "ghost" | "outline";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const { t } = useTranslation();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("theme.change")}
        disabled
      >
        <SunIcon className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant={variant}
      size="icon"
      className="relative"
      aria-label={isDark ? t("theme.switchToLight") : t("theme.switchToDark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <SunIcon className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
