import type { Subscription } from "@/lib/schema";
import { billingCycleLabels } from "@/constants/billing-cycle";
import { currencySymbols } from "@/constants/currency";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/lib/i18n/use-language";
import { ServiceKey } from "@/constants/icons";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import { toIntlLocale } from "@/lib/i18n/format";

export function DayPopoverContent({
  day,
  payments,
  monthName,
  dayOfWeek,
}: {
  day: number;
  payments: Subscription[];
  monthName: string;
  dayOfWeek: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const total = payments.reduce(
    (sum, p) => sum + (Number.parseFloat(String(p.price)) || 0),
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
        {payments.map((payment) => {
          const price = Number.parseFloat(String(payment.price)) || 0;
          const symbol = currencySymbols[payment.currency] ?? "$";
          const platform = payment.platform as ServiceKey;

          return (
            <div
              key={payment.id}
              className="flex items-center gap-3 rounded-lg p-1.5"
            >
              <ServiceIcon service={platform} size="xs" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium capitalize">
                  {payment.name}
                </p>
                <p className="text-muted-foreground text-[11px]">
                  {billingCycleLabels[payment.billingCycle]}
                </p>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums">
                {symbol}
                {price.toLocaleString(toIntlLocale(language), {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          );
        })}
      </div>

      {payments.length > 1 && (
        <div className="border-border border-t border-dashed pt-2.5">
          <div className="flex items-center justify-between px-1.5">
            <span className="text-muted-foreground text-sm">
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
