"use client";

import { CircleCheckIcon, CircleIcon, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PaymentRecord } from "@/app/api/[userid]/payments/route";
import { Button } from "@/components/ui/button";
import { STATUS_CLASSES } from "@/constants/chart-colors";
import {
  type PaymentState,
  useSetPaymentStatus,
} from "@/hooks/use-subscription-payments";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import { cn } from "@/lib/utils";

const STATE_TEXT: Record<Exclude<PaymentState, "untracked">, string> = {
  paid: STATUS_CLASSES.ok.text,
  overdue: STATUS_CLASSES.warning.text,
  pending: STATUS_CLASSES.neutral.text,
};

/** Botón que alterna un cobro entre pagado y pendiente. */
export function PaymentStatusButton({
  subscriptionId,
  dueDate,
  state,
}: {
  subscriptionId: string;
  dueDate: string;
  state: PaymentState;
}) {
  const { t } = useTranslation();
  const setStatus = useSetPaymentStatus();

  if (state === "untracked") return null;

  const isPaid = state === "paid";
  const Icon = setStatus.isPending
    ? Loader2
    : isPaid
      ? CircleCheckIcon
      : CircleIcon;

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-pressed={isPaid}
      aria-label={t(
        isPaid
          ? "dashboard.payments.markUnpaid"
          : "dashboard.payments.markPaid",
      )}
      title={t(
        isPaid
          ? "dashboard.payments.markUnpaid"
          : "dashboard.payments.markPaid",
      )}
      disabled={setStatus.isPending}
      onClick={() =>
        setStatus.mutate({
          subscriptionId,
          dueDate,
          status: isPaid ? "unpaid" : "paid",
        })
      }
      className={cn("shrink-0", STATE_TEXT[state])}
    >
      <Icon className={cn("size-4", setStatus.isPending && "animate-spin")} />
    </Button>
  );
}

/** Texto del estado: "Pagado el 3 oct · automático", "Pendiente", etc. */
export function PaymentStatusLabel({
  state,
  record,
  className,
}: {
  state: PaymentState;
  record: PaymentRecord | undefined;
  className?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  if (state === "untracked") return null;

  let text = t(`dashboard.payments.${state}`);
  if (state === "paid" && record?.paidOn) {
    const date = new Date(`${record.paidOn}T00:00:00`).toLocaleDateString(
      toIntlLocale(language),
      { day: "numeric", month: "short" },
    );
    text = `${t("dashboard.payments.paidOn", { date })} · ${t(
      `dashboard.payments.${record.source}`,
    )}`;
  }

  return (
    <span className={cn("text-[11px]", STATE_TEXT[state], className)}>
      {text}
    </span>
  );
}
