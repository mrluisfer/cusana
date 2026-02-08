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

export function ExportData() {
  const { data, isPending, isError } = useSubscriptions();

  const subscriptions = useMemo(() => data ?? [], [data]);
  const isEmpty = subscriptions.length === 0;
  const isDisabled = isEmpty || isPending || isError;

  const handleCSV = useCallback(
    () => exportToCSV(subscriptions),
    [subscriptions],
  );
  const handleExcel = useCallback(
    () => exportToExcel(subscriptions),
    [subscriptions],
  );
  const handleJSON = useCallback(
    () => exportToJSON(subscriptions),
    [subscriptions],
  );

  const triggerButton = (
    <Button
      variant="outline"
      className="w-full sm:w-auto"
      disabled={isDisabled}
    >
      {isPending ? (
        <Loader2Icon className="mr-2 size-4 animate-spin" />
      ) : isError ? (
        <AlertCircleIcon className="mr-2 size-4" />
      ) : (
        <DownloadIcon className="mr-2 size-4" />
      )}
      Exportar
    </Button>
  );

  // Si está en error, mostrar tooltip con mensaje
  if (isError) {
    return (
      <Tooltip>
        <TooltipTrigger className="w-full sm:w-auto">
          {triggerButton}
        </TooltipTrigger>
        <TooltipContent>No se pudieron cargar los datos</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={triggerButton} />
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            Formato de exportación
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
              Compatible con Excel, Sheets
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCSV}>
          <FileTextIcon className="mr-2 size-4" />
          <div className="flex flex-col">
            <span>CSV (.csv)</span>
            <span className="text-muted-foreground text-[10px]">
              Universal, cualquier editor
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleJSON}>
          <FileJsonIcon className="mr-2 size-4" />
          <div className="flex flex-col">
            <span>JSON (.json)</span>
            <span className="text-muted-foreground text-[10px]">
              Para desarrolladores
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
