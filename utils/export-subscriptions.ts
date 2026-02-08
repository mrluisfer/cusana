import { serviceIcons, type ServiceKey } from "@/constants/icons";
import { getNextBillingDate } from "@/utils/get-next-billing-date";
import * as XLSX from "xlsx";

type ExportableSubscription = {
  id: string;
  name: string;
  platform: ServiceKey;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  billingDay: number;
};

type ExportRow = {
  Servicio: string;
  Plataforma: string;
  Precio: string;
  Moneda: string;
  Ciclo: string;
  "Día de cobro": number;
  "Próximo cobro": string;
};

function getPlatformLabel(platform: ServiceKey): string {
  const service = serviceIcons[platform];
  return service?.label ?? platform;
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price || 0);
}

function toExportRows(subscriptions: ExportableSubscription[]): ExportRow[] {
  return subscriptions.map((sub) => ({
    Servicio: sub.name,
    Plataforma: getPlatformLabel(sub.platform),
    Precio: formatPrice(sub.price, sub.currency),
    Moneda: sub.currency,
    Ciclo: sub.billingCycle === "monthly" ? "Mensual" : "Anual",
    "Día de cobro": sub.billingDay,
    "Próximo cobro": getNextBillingDate(sub.billingDay),
  }));
}

function getFileName(extension: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `suscripciones_${date}.${extension}`;
}

/** Exporta suscripciones como archivo CSV */
export function exportToCSV(subscriptions: ExportableSubscription[]) {
  const rows = toExportRows(subscriptions);

  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]) as (keyof ExportRow)[];

  const csvContent = [
    // BOM for Excel UTF-8 compatibility
    "\uFEFF",
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const value = String(row[h]);
          // Escape values that contain commas, quotes, or newlines
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    ),
  ].join("\n");

  downloadBlob(csvContent, getFileName("csv"), "text/csv;charset=utf-8;");
}

/** Exporta suscripciones como archivo Excel (.xlsx) */
export function exportToExcel(subscriptions: ExportableSubscription[]) {
  const rows = toExportRows(subscriptions);

  if (rows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-ajustar ancho de columnas
  const colWidths = Object.keys(rows[0]).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key as keyof ExportRow]).length),
    );
    return { wch: Math.min(maxLen + 2, 30) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Suscripciones");

  XLSX.writeFile(workbook, getFileName("xlsx"));
}

/** Exporta suscripciones como archivo JSON */
export function exportToJSON(subscriptions: ExportableSubscription[]) {
  if (subscriptions.length === 0) return;

  const data = subscriptions.map((sub) => ({
    name: sub.name,
    platform: sub.platform,
    platformLabel: getPlatformLabel(sub.platform),
    price: sub.price,
    currency: sub.currency,
    billingCycle: sub.billingCycle,
    billingDay: sub.billingDay,
  }));

  const json = JSON.stringify(data, null, 2);
  downloadBlob(json, getFileName("json"), "application/json;charset=utf-8;");
}

function downloadBlob(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
