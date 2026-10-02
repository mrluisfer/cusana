import type { NextRequest } from "next/server";
import {
  getPaymentsInRange,
  type PaymentStatus,
  setPaymentStatus,
  syncAutoPayments,
} from "@/lib/queries/payments";
import type { RouteContext } from "@/types/route-context";
import { toISODate } from "@/utils/get-next-billing-date";

export type PaymentRecord = {
  subscriptionId: string;
  /** Fecha del cobro (YYYY-MM-DD). */
  dueDate: string;
  status: PaymentStatus;
  source: "auto" | "manual";
  /** Día en que se pagó (YYYY-MM-DD), o null si está pendiente. */
  paidOn: string | null;
};

export type PaymentsResponse = { payments: PaymentRecord[] };

const MAX_RANGE_DAYS = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

function parseISODate(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : value;
}

/**
 * "Hoy" del cliente, que puede ir hasta un día adelante o atrás de UTC. Se
 * acota para que un valor manipulado no registre cobros futuros como pagados.
 */
function resolveToday(value: unknown): string {
  const serverToday = Date.now();
  const latest = toISODate(new Date(serverToday + DAY_MS));
  const today = parseISODate(value);
  if (!today) return toISODate(new Date(serverToday));
  return today > latest ? latest : today;
}

export async function GET(
  req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;
  const params = req.nextUrl.searchParams;

  const from = parseISODate(params.get("from"));
  const to = parseISODate(params.get("to"));
  if (!from || !to || from > to) {
    return Response.json(
      { message: "Valid `from` and `to` dates (YYYY-MM-DD) are required" },
      { status: 400 },
    );
  }
  if (Date.parse(to) - Date.parse(from) > MAX_RANGE_DAYS * DAY_MS) {
    return Response.json(
      { message: "Date range is too large" },
      { status: 400 },
    );
  }

  // Registra los cobros que ya llegaron antes de leer, para que el rango
  // devuelto refleje el estado automático actualizado.
  await syncAutoPayments(userid, resolveToday(params.get("today")));

  const rows = await getPaymentsInRange(userid, from, to);

  return Response.json(
    {
      payments: rows.map((row) => ({
        subscriptionId: row.subscriptionId,
        dueDate: String(row.dueDate),
        status: row.status,
        source: row.source,
        paidOn: row.paidOn ? String(row.paidOn) : null,
      })),
    } satisfies PaymentsResponse,
    { status: 200 },
  );
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<{ userid: string }>,
) {
  const { userid } = await ctx.params;
  const body = await req.json().catch(() => null);

  const subscriptionId =
    typeof body?.subscriptionId === "string" ? body.subscriptionId : null;
  const dueDate = parseISODate(body?.dueDate);
  const status: PaymentStatus | null =
    body?.status === "paid" || body?.status === "unpaid" ? body.status : null;

  if (!subscriptionId || !dueDate || !status) {
    return Response.json(
      { message: "subscriptionId, dueDate and status are required" },
      { status: 400 },
    );
  }

  const row = await setPaymentStatus({
    userId: userid,
    subscriptionId,
    dueDate,
    status,
    paidOn: resolveToday(body?.today),
  });

  if (!row) {
    return Response.json(
      { message: "Subscription or billing date not found" },
      { status: 404 },
    );
  }

  return Response.json(
    {
      subscriptionId: row.subscriptionId,
      dueDate: String(row.dueDate),
      status: row.status,
      source: row.source,
      paidOn: row.paidOn ? String(row.paidOn) : null,
    } satisfies PaymentRecord,
    { status: 200 },
  );
}
