"use client";

import { useId, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, SaveIcon } from "lucide-react";
import type { Subscription } from "./columns";
import {
  SubscriptionForm,
  type SubscriptionFormValues,
} from "./subscription-form";

async function updateSubscriptionApi(
  userId: string,
  payload: { id: string } & Record<string, unknown>,
) {
  const response = await fetch(`/api/${userId}/subscription`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la suscripción");
  }

  return response.json();
}

type EditSubscriptionProps = {
  subscription: Subscription;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function EditSubscription({
  subscription,
  open,
  onOpenChangeAction,
}: EditSubscriptionProps) {
  const formId = useId();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const defaultValues = useMemo<SubscriptionFormValues>(
    () => ({
      name: subscription.name,
      platform: subscription.platform as SubscriptionFormValues["platform"],
      price: String(subscription.price),
      currency: subscription.currency as SubscriptionFormValues["currency"],
      billingCycle: subscription.billingCycle,
      billingDay: String(subscription.billingDay),
      billingMonth: subscription.billingMonth
        ? String(subscription.billingMonth)
        : undefined,
    }),
    [subscription],
  );

  const mutation = useMutation({
    mutationFn: (payload: { id: string } & Record<string, unknown>) =>
      updateSubscriptionApi(session!.user.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      onOpenChangeAction(false);
    },
  });

  const onSubmit = (data: SubscriptionFormValues) => {
    mutation.mutate({
      id: subscription.id,
      name: data.name.trim(),
      platform: data.platform,
      price: Number(data.price),
      currency: data.currency,
      billingCycle: data.billingCycle,
      billingDay: Number(data.billingDay),
      billingMonth: data.billingMonth ? Number(data.billingMonth) : null,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChangeAction}>
      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Editar suscripción</SheetTitle>
          <SheetDescription>
            Modifica los datos de tu suscripción. Los cambios quedarán
            registrados en el historial.
          </SheetDescription>
        </SheetHeader>

        <SubscriptionForm
          formId={formId}
          defaultValues={defaultValues}
          onSubmitAction={onSubmit}
          resetKey={open ? subscription.id : null}
        />

        <SheetFooter className="border-t px-6 py-4">
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <SheetClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={mutation.isPending}
                />
              }
            >
              Cancelar
            </SheetClose>
            <Button
              type="submit"
              form={formId}
              disabled={mutation.isPending}
              className="min-w-30"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 size-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
