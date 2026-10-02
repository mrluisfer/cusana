import { useTranslation } from "react-i18next";
import {
  PaymentStatusButton,
  PaymentStatusLabel,
} from "@/components/dashboard/payment-status";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { currencySymbols } from "@/constants/currency";
import type { ServiceKey } from "@/constants/icons";
import { toIntlLocale } from "@/lib/i18n/format";
import { useLanguage } from "@/lib/i18n/use-language";
import type { DayPayment } from "./CalendarDay";

export function DayPopoverContent({
  day,
  payments,
  monthName,
  dayOfWeek,
}: {
  day: number;
  payments: DayPayment[];
  monthName: string;
  dayOfWeek: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const total = payments.reduce(
    (sum, p) => sum + (Number.parseFloat(String(p.subscription.price)) || 0),
    0,
  );

  return (
    <div className="w-full space-y-2.5 p-0.5">
      <p className="text-sm">
        <span className="font-semibold capitalize">
          {monthName} {day},
        </span>{" "}
        <span className="text-muted-foreground capitalize">{dayOfWeek}</span>
      </p>

      <div className="space-y-0.5">
        {payments.map(({ subscription, dueDate, state, record }) => {
          const price = Number.parseFloat(String(subscription.price)) || 0;
          const symbol = currencySymbols[subscription.currency] ?? "$";
          const platform = subscription.platform as ServiceKey;

          return (
            <div
              key={subscription.id}
              className="flex items-center gap-3 rounded-lg p-1.5"
            >
              <ServiceIcon service={platform} size="xs" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">
                  {subscription.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {t(`dashboard.billing.${subscription.billingCycle}`)}
                </p>
                <PaymentStatusLabel
                  state={state}
                  record={record}
                  className="block truncate"
                />
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {symbol}
                {price.toLocaleString(toIntlLocale(language), {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <PaymentStatusButton
                subscriptionId={subscription.id}
                dueDate={dueDate}
                state={state}
              />
            </div>
          );
        })}
      </div>

      {payments.length > 1 && (
        <div className="border-t border-dashed border-border pt-2.5">
          <div className="flex items-center justify-between px-1.5">
            <span className="text-sm text-muted-foreground">
              {t("dashboard.calendar.total")}
            </span>
            <span className="font-mono text-sm font-bold tabular-nums">
              $
              {total.toLocaleString(toIntlLocale(language), {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
