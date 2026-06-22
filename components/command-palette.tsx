"use client";

import { aiChatOpenAtom, commandOpenAtom, currencyAtom } from "@/atoms";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Currency, currencyArray, currencySymbols } from "@/constants/currency";
import { type ServiceKey } from "@/constants/icons";
import { PLATFORM_URLS } from "@/constants/platform-urls";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import type { Subscription } from "@/lib/schema";
import {
  type ExportLabels,
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "@/utils/export-subscriptions";
import { useSetAtom, useAtom } from "jotai";
import {
  CommandIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HomeIcon,
  MonitorIcon,
  MoonIcon,
  ShieldIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

const emptySubscribe = () => () => {};

/** Toolbar button that opens the command palette (also reachable via ⌘K / Ctrl+K). */
export function CommandMenuButton() {
  const { t } = useTranslation();
  const setOpen = useSetAtom(commandOpenAtom);
  // Resolve the platform modifier only after mount to avoid hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const modifier = mounted
    ? /mac/i.test(navigator.platform)
      ? "⌘"
      : "Ctrl"
    : null;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            aria-label={t("command.trigger")}
            className="gap-2"
          />
        }
      >
        <CommandIcon className="size-4" />
        {modifier && (
          <Kbd className="hidden sm:inline-flex">{modifier} K</Kbd>
        )}
      </TooltipTrigger>
      <TooltipContent>{t("command.trigger")}</TooltipContent>
    </Tooltip>
  );
}

export function CommandPalette() {
  const { t } = useTranslation();
  const [open, setOpen] = useAtom(commandOpenAtom);
  const setCurrency = useSetAtom(currencyAtom);
  const setAiOpen = useSetAtom(aiChatOpenAtom);
  const router = useRouter();
  const { setTheme } = useTheme();
  const { data } = useSubscriptions();
  const subscriptions = (data ?? []) as Subscription[];
  const activeSubscriptions = subscriptions.filter((s) => s.active !== false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const run = useCallback(
    (action: () => void) => {
      setOpen(false);
      action();
    },
    [setOpen],
  );

  const exportLabels = useCallback(
    (): ExportLabels => ({
      columns: {
        service: t("dashboard.export.columns.service"),
        platform: t("dashboard.export.columns.platform"),
        price: t("dashboard.export.columns.price"),
        currency: t("dashboard.export.columns.currency"),
        cycle: t("dashboard.export.columns.cycle"),
        billingDay: t("dashboard.export.columns.billingDay"),
        nextCharge: t("dashboard.export.columns.nextCharge"),
      },
      monthly: t("dashboard.export.monthly"),
      yearly: t("dashboard.export.yearly"),
      fileNamePrefix: t("dashboard.export.fileNamePrefix"),
      sheetName: t("dashboard.export.sheetName"),
    }),
    [t],
  );

  const openSubscription = (sub: Subscription) => {
    const url = sub.url || PLATFORM_URLS[sub.platform as ServiceKey];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t("command.trigger")}
      description={t("command.placeholder")}
    >
      <Command>
        <CommandInput placeholder={t("command.placeholder")} />
        <CommandList>
          <CommandEmpty>{t("command.empty")}</CommandEmpty>

          <CommandGroup heading={t("command.groupActions")}>
            <CommandItem
              value="ai assistant asistente"
              onSelect={() => run(() => setAiOpen(true))}
            >
              <SparklesIcon />
              {t("command.openAi")}
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading={t("command.groupCurrency")}>
            {currencyArray.map((curr) => (
              <CommandItem
                key={curr}
                value={`currency ${curr}`}
                onSelect={() => run(() => setCurrency(curr as Currency))}
              >
                <DollarSignIcon />
                {t("command.setCurrency", { currency: curr })}
                <CommandShortcut>{currencySymbols[curr]}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={t("command.groupTheme")}>
            <CommandItem
              value="theme light claro"
              onSelect={() => run(() => setTheme("light"))}
            >
              <SunIcon />
              {t("command.themeLight")}
            </CommandItem>
            <CommandItem
              value="theme dark oscuro"
              onSelect={() => run(() => setTheme("dark"))}
            >
              <MoonIcon />
              {t("command.themeDark")}
            </CommandItem>
            <CommandItem
              value="theme system sistema"
              onSelect={() => run(() => setTheme("system"))}
            >
              <MonitorIcon />
              {t("command.themeSystem")}
            </CommandItem>
          </CommandGroup>

          {activeSubscriptions.length > 0 && (
            <CommandGroup heading={t("command.groupExport")}>
              <CommandItem
                value="export excel xlsx"
                onSelect={() =>
                  run(() => exportToExcel(subscriptions, exportLabels()))
                }
              >
                <FileSpreadsheetIcon />
                {t("command.exportExcel")}
              </CommandItem>
              <CommandItem
                value="export csv"
                onSelect={() =>
                  run(() => exportToCSV(subscriptions, exportLabels()))
                }
              >
                <FileTextIcon />
                {t("command.exportCsv")}
              </CommandItem>
              <CommandItem
                value="export json"
                onSelect={() =>
                  run(() => exportToJSON(subscriptions, exportLabels()))
                }
              >
                <FileJsonIcon />
                {t("command.exportJson")}
              </CommandItem>
            </CommandGroup>
          )}

          <CommandGroup heading={t("command.groupNav")}>
            <CommandItem
              value="home inicio dashboard"
              onSelect={() => run(() => router.push("/dashboard"))}
            >
              <HomeIcon />
              {t("command.navHome")}
            </CommandItem>
            <CommandItem
              value="privacy privacidad"
              onSelect={() => run(() => router.push("/privacy"))}
            >
              <ShieldIcon />
              {t("command.navPrivacy")}
            </CommandItem>
            <CommandItem
              value="terms terminos"
              onSelect={() => run(() => router.push("/terms"))}
            >
              <FileTextIcon />
              {t("command.navTerms")}
            </CommandItem>
          </CommandGroup>

          {activeSubscriptions.length > 0 && (
            <CommandGroup heading={t("command.groupSubscriptions")}>
              {activeSubscriptions.map((sub) => (
                <CommandItem
                  key={sub.id}
                  value={`sub ${sub.name} ${sub.platform}`}
                  onSelect={() => run(() => openSubscription(sub))}
                >
                  <ServiceIcon
                    service={sub.platform as ServiceKey}
                    size="2xs"
                  />
                  <span className="truncate">{sub.name}</span>
                  <ExternalLinkIcon className="ml-auto opacity-50" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
