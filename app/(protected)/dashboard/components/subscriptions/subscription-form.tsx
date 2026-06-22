"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allowedPlatformsArray } from "@/constants/allowed-platforms";
import { billingCycleArray } from "@/constants/billing-cycle";
import { currencyArray, currencySymbols } from "@/constants/currency";
import { serviceIcons, type ServiceKey } from "@/constants/icons";
import { monthLabels, monthsArray } from "@/constants/months";
import { DollarSignIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";

// ============================================
// Schema
// ============================================
export function createSubscriptionFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(2, t("dashboard.form.errors.nameMin"))
      .max(100, t("dashboard.form.errors.nameMax")),
    platform: z.enum(allowedPlatformsArray, {
      message: t("dashboard.form.errors.platform"),
    }),
    price: z
      .string()
      .min(1, t("dashboard.form.errors.priceRequired"))
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: t("dashboard.form.errors.priceMin"),
      }),
    currency: z.enum(currencyArray, {
      message: t("dashboard.form.errors.currency"),
    }),
    billingCycle: z.enum(billingCycleArray, {
      message: t("dashboard.form.errors.cycle"),
    }),
    billingDay: z
      .string()
      .min(1, t("dashboard.form.errors.dayRequired"))
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= 1 && num <= 31;
        },
        { message: t("dashboard.form.errors.dayRange") },
      ),
    billingMonth: z.string().optional(),
  });
}

export type SubscriptionFormValues = z.infer<
  ReturnType<typeof createSubscriptionFormSchema>
>;

/** Platform label, translating the generic "otros" entry which is the only localized one. */
function getPlatformDisplayLabel(platform: ServiceKey, t: TFunction): string {
  if (platform === "otros") return t("dashboard.form.platformOther");
  return serviceIcons[platform]?.label ?? platform;
}

// ============================================
// Props
// ============================================
type SubscriptionFormProps = {
  formId: string;
  defaultValues: SubscriptionFormValues;
  onSubmitAction: (data: SubscriptionFormValues) => void;
  /** When provided, resets the form to these values on change */
  resetKey?: unknown;
};

export function SubscriptionForm({
  formId,
  defaultValues,
  onSubmitAction,
  resetKey,
}: SubscriptionFormProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createSubscriptionFormSchema(t), [t]);
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  // Reset form when resetKey changes (useful for edit mode)
  useEffect(() => {
    if (resetKey !== undefined) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // Live values para la tarjeta de preview y el helper de promedio mensual.
  const watched = useWatch({ control: form.control });
  const selectedCycle = watched.billingCycle;
  const selectedPlatform = (watched.platform ??
    defaultValues.platform) as ServiceKey;
  const selectedCurrency = (watched.currency ??
    defaultValues.currency) as keyof typeof currencySymbols;
  const priceNumber = Number(watched.price);
  const validPrice = Number.isFinite(priceNumber) && priceNumber > 0;

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmitAction)}
      className="flex-1 overflow-y-auto"
    >
      {/* Live preview — refleja lo que estás creando */}
      <LivePreview
        platform={selectedPlatform}
        name={watched.name}
        price={validPrice ? priceNumber : null}
        currency={selectedCurrency}
        cycle={selectedCycle}
      />

      <FieldGroup className="space-y-5 px-6 pb-6">
        {/* Plataforma — primero porque define el tono visual y sugiere nombre */}
        <Controller
          name="platform"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("dashboard.form.platform")}
              </FieldLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Auto-sugerir el nombre solo si está vacío o si todavía coincide
                  // con la sugerencia previa (i.e. el user no lo personalizó).
                  const current = form.getValues("name").trim();
                  const prevLabel =
                    serviceIcons[field.value as ServiceKey]?.label ?? "";
                  const nextLabel =
                    serviceIcons[value as ServiceKey]?.label ?? "";
                  if (!current || current === prevLabel) {
                    form.setValue("name", nextLabel, { shouldDirty: true });
                  }
                }}
              >
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue
                    placeholder={t("dashboard.form.platformPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {allowedPlatformsArray.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        <ServiceIcon
                          service={platform as ServiceKey}
                          size="xs"
                        />
                        <span>
                          {getPlatformDisplayLabel(platform as ServiceKey, t)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Nombre — auto-sugerido al cambiar plataforma */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                {t("dashboard.form.name")}
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder={t("dashboard.form.namePlaceholder")}
                autoComplete="off"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Precio + Moneda */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("dashboard.form.price")}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <DollarSignIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    autoComplete="off"
                  />
                </InputGroup>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("dashboard.form.currency")}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyArray.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        <span className="font-mono">
                          {currencySymbols[currency]}
                        </span>{" "}
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Ciclo + Día */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="billingCycle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("dashboard.form.frequency")}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue
                      render={
                        <div>
                          {field.value
                            ? t(`dashboard.billing.${field.value}`)
                            : t("dashboard.form.cyclePlaceholder")}
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {billingCycleArray.map((cycle) => (
                      <SelectItem key={cycle} value={cycle}>
                        {t(`dashboard.billing.${cycle}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="billingDay"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("dashboard.form.billingDay")}
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="number"
                  min={1}
                  max={31}
                  inputMode="numeric"
                  placeholder={t("dashboard.form.billingDayPlaceholder")}
                  autoComplete="off"
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Helper: promedio mensual cuando es anual */}
        {selectedCycle === "yearly" && validPrice && (
          <p
            className="bg-primary/5 text-muted-foreground rounded-lg px-3 py-2 text-xs"
            aria-live="polite"
          >
            <span className="text-foreground font-medium">
              {currencySymbols[selectedCurrency]}
              {(priceNumber / 12).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            {t("dashboard.form.monthlyAverage")}
          </p>
        )}

        {/* Mes de cobro (solo para anuales) */}
        {selectedCycle === "yearly" && (
          <Controller
            name="billingMonth"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  {t("dashboard.form.billingMonth")}{" "}
                  <span className="text-muted-foreground font-normal">
                    {t("dashboard.form.optional")}
                  </span>
                </FieldLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue
                      placeholder={t("dashboard.form.monthPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {monthsArray.map((month) => (
                      <SelectItem key={month} value={String(month)}>
                        {monthLabels[month]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>
    </form>
  );
}

// ============================================
// Live preview
// ============================================
function LivePreview({
  platform,
  name,
  price,
  currency,
  cycle,
}: {
  platform: ServiceKey;
  name?: string;
  price: number | null;
  currency: keyof typeof currencySymbols;
  cycle?: (typeof billingCycleArray)[number];
}) {
  const { t } = useTranslation();
  const symbol = currencySymbols[currency] ?? "$";
  const config = serviceIcons[platform];
  const platformLabel = getPlatformDisplayLabel(platform, t);
  const displayName =
    name?.trim() || config?.label || t("dashboard.form.previewName");
  const cycleSuffix =
    cycle === "yearly"
      ? t("dashboard.billing.perYearShort")
      : t("dashboard.billing.perMonthShort");

  return (
    <div className="px-6 pt-5 pb-4" aria-live="polite">
      <div className="border-border/60 bg-card/40 supports-[backdrop-filter]:bg-card/30 relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 backdrop-blur-xl">
        {/* Accent gradient teñido por color de marca */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            background: config?.bgColor
              ? `radial-gradient(circle at 0% 50%, ${config.bgColor}, transparent 60%)`
              : undefined,
          }}
        />
        <ServiceIcon
          service={platform}
          size="md"
          className="relative shrink-0"
        />
        <div className="relative min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-semibold">
            {displayName}
          </p>
          <p className="text-muted-foreground text-xs">
            {platformLabel}
            {cycle ? ` · ${t(`dashboard.billing.${cycle}`)}` : ""}
          </p>
        </div>
        <p className="relative shrink-0 text-right">
          <span className="text-foreground font-mono text-base font-bold tabular-nums">
            {symbol}
            {price !== null
              ? price.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "—"}
          </span>
          <span className="text-muted-foreground ml-0.5 text-[10px]">
            {cycleSuffix}
          </span>
        </p>
      </div>
    </div>
  );
}
