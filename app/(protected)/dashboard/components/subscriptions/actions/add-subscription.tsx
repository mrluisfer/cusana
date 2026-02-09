"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { AllowedPlatforms } from "@/constants/allowed-platforms";
import { BillingCycle } from "@/constants/billing-cycle";
import { Currency } from "@/constants/currency";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusIcon, SaveIcon } from "lucide-react";
import {
  SubscriptionForm,
  type SubscriptionFormValues,
} from "../subscription-form";

const defaultValues: SubscriptionFormValues = {
  name: "",
  platform: AllowedPlatforms.NETFLIX,
  price: "",
  currency: Currency.MXN,
  billingCycle: BillingCycle.MONTHLY,
  billingDay: "1",
};

// Tipo para enviar a la API (con números)
type SubscriptionPayload = {
  name: string;
  platform: AllowedPlatforms;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  billingDay: number;
  billingMonth?: number;
};

type AddSubscriptionProps = {
  triggerProps?: React.ComponentPropsWithoutRef<typeof Button>;
  label?: string;
};

export const AddSubscription = ({
  triggerProps,
  label,
}: AddSubscriptionProps) => {
  const formId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubscriptionPayload) => {
      if (!session?.user.id) {
        throw new Error("User ID is required");
      }

      const response = await fetch(`/api/${session?.user.id}/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la suscripción");
      }

      return response.json();
    },
  });

  const onSubmit = async (data: SubscriptionFormValues) => {
    try {
      setIsSubmitting(true);

      const payload: SubscriptionPayload = {
        name: data.name.trim(),
        platform: data.platform,
        price: Number(data.price),
        currency: data.currency,
        billingCycle: data.billingCycle,
        billingDay: Number(data.billingDay),
        ...(data.billingMonth && { billingMonth: Number(data.billingMonth) }),
      };

      await mutation.mutateAsync(payload);
      setIsOpen(false);

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button {...triggerProps} />}>
        <PlusIcon />
        {label?.length ? (
          label
        ) : (
          <>
            <span className="hidden sm:inline">Agregar suscripción</span>
            <span className="sm:hidden">Agregar</span>
          </>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Nueva suscripción</SheetTitle>
          <SheetDescription>
            Agrega los detalles de tu suscripción para llevar un mejor control
            de tus gastos.
          </SheetDescription>
        </SheetHeader>

        <SubscriptionForm
          formId={formId}
          defaultValues={defaultValues}
          onSubmitAction={onSubmit}
          resetKey={isOpen}
        />

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
