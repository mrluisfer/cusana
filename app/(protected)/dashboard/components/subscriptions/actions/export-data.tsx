"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import {
  type ExportLabels,
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "@/utils/export-subscriptions";
import {
  AlertCircleIcon,
  DownloadIcon,
  FileJsonIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  Loader2Icon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function ExportData() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useSubscriptions();

  const subscriptions = useMemo(() => data ?? [], [data]);
  const isEmpty = subscriptions.length === 0;
  const isDisabled = isEmpty || isPending || isError;

  const labels = useMemo<ExportLabels>(
    () => ({
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

  const handleCSV = useCallback(
    () => exportToCSV(subscriptions, labels),
    [subscriptions, labels],
  );
  const handleExcel = useCallback(
    () => exportToExcel(subscriptions, labels),
    [subscriptions, labels],
  );
  const handleJSON = useCallback(
    () => exportToJSON(subscriptions, labels),
    [subscriptions, labels],
  );

  const triggerButton = (
    <Button variant="outline" size="icon-lg" disabled={isDisabled}>
      {isPending ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : isError ? (
        <AlertCircleIcon className="size-4" />
      ) : (
        <DownloadIcon className="size-4" />
      )}
      <span className="sr-only">{t("dashboard.export.sr")}</span>
    </Button>
  );

  // Si está en error, mostrar tooltip con mensaje
  if (isError) {
    return (
      <Tooltip>
        <TooltipTrigger>{triggerButton}</TooltipTrigger>
        <TooltipContent>{t("dashboard.export.loadError")}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={<DropdownMenuTrigger render={triggerButton} />}
        />
        <TooltipContent>{t("dashboard.export.tooltip")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {t("dashboard.export.formatLabel")}
            <span className="text-muted-foreground ml-1 font-normal">
              ({subscriptions.length})
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleExcel}>
          <FileSpreadsheetIcon className="mr-2 size-4" />
          <div className="flex flex-col">
            <span>Excel (.xlsx)</span>
            <span className="text-muted-foreground text-[10px]">
              {t("dashboard.export.excelDesc")}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCSV}>
          <FileTextIcon className="mr-2 size-4" />
          <div className="flex flex-col">
            <span>CSV (.csv)</span>
            <span className="text-muted-foreground text-[10px]">
              {t("dashboard.export.csvDesc")}
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleJSON}>
          <FileJsonIcon className="mr-2 size-4" />
          <div className="flex flex-col">
            <span>JSON (.json)</span>
            <span className="text-muted-foreground text-[10px]">
              {t("dashboard.export.jsonDesc")}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
