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
import { Spinner } from "@/components/ui/spinner";
import { AllowedPlatforms } from "@/constants/allowed-platforms";
import { BillingCycle } from "@/constants/billing-cycle";
import { Currency } from "@/constants/currency";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SaveIcon, SparklesIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SubscriptionPayload) => {
      if (!session?.user.id) {
        throw new Error("User ID is required");
      }

      const response = await fetch(`/api/${session.user.id}/subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("dashboard.add.saveError"));
      }

      return response.json();
    },
    onSuccess: (_, payload) => {
      toast.success(t("dashboard.add.successTitle"), {
        description: t("dashboard.add.successDescription", {
          name: payload.name,
        }),
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUBSCRIPTIONS] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(t("dashboard.add.errorTitle"), {
        description:
          error instanceof Error
            ? error.message
            : t("dashboard.add.errorDescription"),
      });
    },
  });

  const onSubmit = (data: SubscriptionFormValues) => {
    const payload: SubscriptionPayload = {
      name: data.name.trim(),
      platform: data.platform,
      price: Number(data.price),
      currency: data.currency,
      billingCycle: data.billingCycle,
      billingDay: Number(data.billingDay),
      ...(data.billingMonth && { billingMonth: Number(data.billingMonth) }),
    };
    mutation.mutate(payload);
  };

  const isSubmitting = mutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={<Button {...triggerProps} />}>
        <PlusIcon />
        {label?.length ? (
          label
        ) : (
          <>
            <span className="hidden sm:inline">
              {t("dashboard.add.trigger")}
            </span>
            <span className="sm:hidden">{t("dashboard.add.triggerShort")}</span>
          </>
        )}
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-border/60 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl ring-1">
              <SparklesIcon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-base">
                {t("dashboard.add.title")}
              </SheetTitle>
              <SheetDescription className="text-xs">
                {t("dashboard.add.description")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <SubscriptionForm
          formId={formId}
          defaultValues={defaultValues}
          onSubmitAction={onSubmit}
          resetKey={isOpen}
        />

        <SheetFooter className="border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 border-t px-6 py-4 backdrop-blur-xl">
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
              {t("dashboard.add.cancel")}
            </SheetClose>
            <Button
              type="submit"
              form={formId}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <Spinner aria-hidden="true" />
                  {t("dashboard.add.saving")}
                </>
              ) : (
                <>
                  <SaveIcon className="size-4" aria-hidden="true" />
                  {t("dashboard.add.save")}
                </>
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
