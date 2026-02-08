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
import type { ServiceKey } from "@/constants/icons";
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "@/utils/export-subscriptions";
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileJsonIcon,
} from "lucide-react";
import { useCallback } from "react";

type ExportableSubscription = {
  id: string;
  name: string;
  platform: ServiceKey;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  billingDay: number;
};

type ExportDataProps = {
  data?: ExportableSubscription[];
};

export function ExportData({ data = [] }: ExportDataProps) {
  const isEmpty = data.length === 0;

  const handleCSV = useCallback(() => exportToCSV(data), [data]);
  const handleExcel = useCallback(() => exportToExcel(data), [data]);
  const handleJSON = useCallback(() => exportToJSON(data), [data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isEmpty}
          />
        }
      >
        <DownloadIcon className="mr-2 size-4" />
        Exportar
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
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
