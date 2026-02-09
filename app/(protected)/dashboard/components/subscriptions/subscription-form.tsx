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
import {
  billingCycleArray,
  billingCycleLabels,
} from "@/constants/billing-cycle";
import { currencyArray, currencySymbols } from "@/constants/currency";
import { monthLabels, monthsArray } from "@/constants/months";
import { DollarSignIcon } from "lucide-react";
import { useEffect } from "react";

// ============================================
// Schema
// ============================================
export const subscriptionFormSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  platform: z.enum(allowedPlatformsArray, {
    message: "Selecciona una plataforma",
  }),
  price: z
    .string()
    .min(1, "El precio es requerido")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "El precio debe ser mayor a 0",
    }),
  currency: z.enum(currencyArray, {
    message: "Selecciona una moneda",
  }),
  billingCycle: z.enum(billingCycleArray, {
    message: "Selecciona un ciclo",
  }),
  billingDay: z
    .string()
    .min(1, "El día es requerido")
    .refine(
      (val) => {
        const num = Number(val);
        return !Number.isNaN(num) && num >= 1 && num <= 31;
      },
      { message: "Día debe ser entre 1 y 31" },
    ),
  billingMonth: z.string().optional(),
});

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

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
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
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

  const selectedCycle = useWatch({
    control: form.control,
    name: "billingCycle",
  });

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmitAction)}
      className="flex-1 overflow-y-auto"
    >
      <FieldGroup className="space-y-5 p-6">
        {/* Nombre */}
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Nombre del servicio</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="Ej: Netflix Premium"
                autoComplete="off"
                autoFocus
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />

        {/* Plataforma */}
        <Controller
          name="platform"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Plataforma</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="Selecciona una plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {allowedPlatformsArray.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        <ServiceIcon service={platform} size="sm" />
                        <span className="capitalize">{platform}</span>
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

        {/* Precio y Moneda */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
          <Controller
            name="price"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Precio</FieldLabel>
                <div className="relative">
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
                      className="pl-8"
                      autoComplete="off"
                    />
                  </InputGroup>
                </div>
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
                <FieldLabel htmlFor={field.name}>Moneda</FieldLabel>
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

        {/* Ciclo y Día */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            name="billingCycle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Ciclo</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue
                      render={
                        <div>
                          {field.value
                            ? billingCycleLabels[
                                field.value as (typeof billingCycleArray)[number]
                              ]
                            : "Selecciona un ciclo"}
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {billingCycleArray.map((cycle) => (
                      <SelectItem key={cycle} value={cycle}>
                        {billingCycleLabels[cycle]}
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
                <FieldLabel htmlFor={field.name}>Día de cobro</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="text"
                  inputMode="numeric"
                  placeholder="1-31"
                  autoComplete="off"
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </div>

        {/* Mes de cobro (solo para anuales) */}
        {selectedCycle === "yearly" && (
          <Controller
            name="billingMonth"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Mes de cobro (opcional)
                </FieldLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue placeholder="Selecciona el mes" />
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
