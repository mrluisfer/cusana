import { serviceIcons, type ServiceKey } from "@/constants/icons";
import { getNextBillingDate } from "@/utils/get-next-billing-date";
import * as XLSX from "xlsx";

type ExportableSubscription = {
  id: string;
  name: string;
  platform: string;
  price: number | string;
  currency: string;
  billingCycle: "monthly" | "yearly";
  billingDay: number;
  billingMonth?: number | null;
  createdAt: string | Date;
};

/** Translated labels supplied by the caller so exports follow the active language. */
export type ExportLabels = {
  columns: {
    service: string;
    platform: string;
    price: string;
    currency: string;
    cycle: string;
    billingDay: string;
    nextCharge: string;
  };
  monthly: string;
  yearly: string;
  fileNamePrefix: string;
  sheetName: string;
};

type ExportRow = Record<string, string | number>;

function getPlatformLabel(platform: string): string {
  const service = serviceIcons[platform as ServiceKey];
  return service?.label ?? platform;
}

const priceFormatterCache = new Map<string, Intl.NumberFormat>();

function getPriceFormatter(currency: string) {
  let f = priceFormatterCache.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    });
    priceFormatterCache.set(currency, f);
  }
  return f;
}

function formatPrice(price: number | string, currency: string): string {
  return getPriceFormatter(currency).format(Number(price) || 0);
}

function toExportRows(
  subscriptions: ExportableSubscription[],
  labels: ExportLabels,
): ExportRow[] {
  const { columns } = labels;
  return subscriptions.map((sub) => ({
    [columns.service]: sub.name,
    [columns.platform]: getPlatformLabel(sub.platform),
    [columns.price]: formatPrice(sub.price, sub.currency),
    [columns.currency]: sub.currency,
    [columns.cycle]: sub.billingCycle === "monthly" ? labels.monthly : labels.yearly,
    [columns.billingDay]: sub.billingDay,
    [columns.nextCharge]: getNextBillingDate({
      billingDay: sub.billingDay,
      billingCycle: sub.billingCycle,
      createdAt: sub.createdAt,
      billingMonth: sub.billingMonth,
    }),
  }));
}

function getFileName(prefix: string, extension: string): string {
  const date = new Date().toISOString().split("T")[0];
  return `${prefix}_${date}.${extension}`;
}

/** Exporta suscripciones como archivo CSV */
export function exportToCSV(
  subscriptions: ExportableSubscription[],
  labels: ExportLabels,
) {
  const rows = toExportRows(subscriptions, labels);

  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);

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

  downloadBlob(
    csvContent,
    getFileName(labels.fileNamePrefix, "csv"),
    "text/csv;charset=utf-8;",
  );
}

/** Exporta suscripciones como archivo Excel (.xlsx) */
export function exportToExcel(
  subscriptions: ExportableSubscription[],
  labels: ExportLabels,
) {
  const rows = toExportRows(subscriptions, labels);

  if (rows.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-ajustar ancho de columnas
  const colWidths = Object.keys(rows[0]).map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key]).length),
    );
    return { wch: Math.min(maxLen + 2, 30) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, labels.sheetName);

  XLSX.writeFile(workbook, getFileName(labels.fileNamePrefix, "xlsx"));
}

/** Exporta suscripciones como archivo JSON */
export function exportToJSON(
  subscriptions: ExportableSubscription[],
  labels: ExportLabels,
) {
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
  downloadBlob(
    json,
    getFileName(labels.fileNamePrefix, "json"),
    "application/json;charset=utf-8;",
  );
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
