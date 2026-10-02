// hooks/use-subscription-payments.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PaymentRecord,
  PaymentsResponse,
} from "@/app/api/[userid]/payments/route";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import type { PaymentStatus } from "@/lib/queries/payments";
import { toISODate } from "@/utils/get-next-billing-date";

/** Estado visible de un cobro concreto. */
export type PaymentState = "paid" | "pending" | "overdue" | "untracked";

export const paymentKey = (subscriptionId: string, dueDate: string) =>
  `${subscriptionId}:${dueDate}`;

// "Hoy" del navegador: el servidor corre en UTC y no sabe en qué día está el
// usuario. Se calcula al hacer la petición, nunca durante el render.
const localToday = () => toISODate(new Date());

async function fetchPayments(
  userId: string,
  from: string,
  to: string,
): Promise<PaymentsResponse> {
  const response = await fetch(
    `/api/${userId}/payments?from=${from}&to=${to}&today=${localToday()}`,
  );
  if (!response.ok) throw new Error("Failed to fetch payments");
  return response.json();
}

async function savePaymentStatus(
  userId: string,
  input: { subscriptionId: string; dueDate: string; status: PaymentStatus },
): Promise<PaymentRecord> {
  const response = await fetch(`/api/${userId}/payments`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, today: localToday() }),
  });
  if (!response.ok) throw new Error("Failed to save payment");
  return response.json();
}

// Referencia estable para que React Query memorice el resultado de `select`.
const toPaymentMap = (data: PaymentsResponse) =>
  new Map(
    data.payments.map((payment) => [
      paymentKey(payment.subscriptionId, payment.dueDate),
      payment,
    ]),
  );

/** Cobros registrados entre `from` y `to` (YYYY-MM-DD), indexados por `paymentKey`. */
export function usePayments(from: string, to: string) {
  const { data: session } = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: [QueryKeys.PAYMENTS, from, to],
    queryFn: () => fetchPayments(userId!, from, to),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    select: toPaymentMap,
  });
}

/** Marca un cobro como pagado o pendiente y refresca todos los rangos. */
export function useSetPaymentStatus() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      subscriptionId: string;
      dueDate: string;
      status: PaymentStatus;
    }) => savePaymentStatus(session!.user.id, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKeys.PAYMENTS] }),
  });
}

/**
 * Lo registrado manda. Sin fila, un cobro anterior a la creación de la
 * suscripción no se rastrea, y uno cuya fecha ya llegó cuenta como pagado
 * (la sincronización automática lo registra al consultar).
 */
export function getPaymentState({
  record,
  dueDate,
  today,
  createdAt,
}: {
  record: PaymentRecord | undefined;
  dueDate: string;
  today: string;
  createdAt: string | Date;
}): PaymentState {
  if (record) {
    if (record.status === "paid") return "paid";
    return dueDate <= today ? "overdue" : "pending";
  }
  if (dueDate < toISODate(new Date(createdAt))) return "untracked";
  return dueDate <= today ? "paid" : "pending";
}
