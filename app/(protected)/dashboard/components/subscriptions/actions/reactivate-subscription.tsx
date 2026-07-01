"use client";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Subscription } from "../columns";

async function reactivateSubscriptionApi(
  userId: string,
  subscriptionId: string,
) {
  const response = await fetch(`/api/${userId}/subscription`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: subscriptionId, active: true }),
  });

  if (!response.ok) {
    throw new Error("Failed to reactivate the subscription");
  }

  return response.json();
}

type ReactivateSubscriptionProps = {
  subscription: Subscription;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function ReactivateSubscription({
  subscription,
  open,
  onOpenChangeAction,
}: ReactivateSubscriptionProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      reactivateSubscriptionApi(session!.user.id, subscription.id),
    onSuccess: () => {
      // La suscripción vuelve a estar activa: refrescar ambas tablas.
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUBSCRIPTIONS] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.INACTIVE_SUBSCRIPTIONS],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RESUME_TOTAL] });
      onOpenChangeAction(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dashboard.reactivate.title")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.reactivate.confirmLead")}{" "}
            <strong className="text-foreground">{subscription.name}</strong>
            {t("dashboard.reactivate.confirmTail")}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-3">
          <ServiceIcon service={subscription.platform} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{subscription.name}</p>
            <p className="text-muted-foreground text-xs capitalize">
              {subscription.platform}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
              />
            }
          >
            {t("dashboard.reactivate.cancel")}
          </DialogClose>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("dashboard.reactivate.reactivating")}
              </>
            ) : (
              <>
                <RotateCcwIcon className="mr-2 size-4" />
                {t("dashboard.reactivate.reactivate")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
