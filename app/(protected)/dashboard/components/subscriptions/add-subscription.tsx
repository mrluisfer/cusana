"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AllowedPlatforms,
  allowedPlatformsArray,
} from "@/constants/allowed-platforms";
import {
  BillingCycle,
  billingCycleArray,
  billingCycleLabels,
} from "@/constants/billing-cycle";
import { Currency, currencyArray, currencySymbols } from "@/constants/currency";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusIcon, SaveIcon } from "lucide-react";

// ============================================
// Schema - sin transformaciones para evitar conflictos de tipos
// ============================================
const formSchema = z.object({
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
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
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
        return !isNaN(num) && num >= 1 && num <= 31;
      },
      { message: "Día debe ser entre 1 y 31" },
    ),
});

type FormValues = z.infer<typeof formSchema>;

// Tipo para enviar a la API (con números)
type SubscriptionPayload = {
  name: string;
  platform: AllowedPlatforms;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingDay: number;
};

// ============================================
// Valores por defecto
// ============================================
const defaultValues: FormValues = {
  name: "",
  platform: AllowedPlatforms.NETFLIX,
  price: "",
  currency: Currency.MXN,
  billingCycle: BillingCycle.MONTHLY,
  billingDay: "1",
};

type AddSubscriptionProps = {
  triggerProps?: React.ComponentPropsWithoutRef<typeof Button>;
};

export const AddSubscription = ({ triggerProps }: AddSubscriptionProps) => {
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onTouched",
  });

  const mutation = useMutation({
    mutationFn: async (payload: SubscriptionPayload) => {
      if (!session?.user.id) {
        throw new Error("User ID is required");
      }

      const response = await fetch(`/api/${session?.user.id}/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la suscripción");
      }

      return response.json();
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      // Transformar a tipos correctos para la API
      const payload: SubscriptionPayload = {
        name: data.name.trim(),
        platform: data.platform,
        price: Number(data.price),
        currency: data.currency,
        billingCycle: data.billingCycle,
        billingDay: Number(data.billingDay),
      };

      await mutation.mutateAsync(payload);
      form.reset(defaultValues);
      setIsOpen(false);

      // Refrescar las suscripciones en caché
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset(defaultValues);
    }
  };

  const selectedCurrency = form.watch("currency");

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button {...triggerProps} />}>
        <PlusIcon className="mr-2 size-4" />
        <span className="hidden sm:inline">Agregar suscripción</span>
        <span className="sm:hidden">Agregar</span>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Nueva suscripción</SheetTitle>
          <SheetDescription>
            Agrega los detalles de tu suscripción para llevar un mejor control
            de tus gastos.
          </SheetDescription>
        </SheetHeader>

        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <FieldGroup className="space-y-5 p-6">
            {/* Nombre */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nombre del servicio
                  </FieldLabel>
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
                      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                        {currencySymbols[selectedCurrency]}
                      </span>
                      <Input
                        {...field}
                        id={field.name}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        className="pl-8"
                        autoComplete="off"
                      />
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
                        <SelectValue />
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
          </FieldGroup>
        </form>

        <SheetFooter className="border-t px-6 py-4">
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                />
              }
            >
              Cancelar
            </SheetClose>
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              className="min-w-30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 size-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
