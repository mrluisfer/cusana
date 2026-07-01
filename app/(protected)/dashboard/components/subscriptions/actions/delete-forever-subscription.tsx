"use client";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, TriangleAlertIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Subscription } from "../columns";

async function hardDeleteSubscriptionApi(
  userId: string,
  subscriptionId: string,
) {
  const response = await fetch(
    `/api/${userId}/subscription?id=${subscriptionId}&permanent=true`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Failed to permanently delete the subscription");
  }

  return response.json();
}

type DeleteForeverSubscriptionProps = {
  subscription: Subscription;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function DeleteForeverSubscription({
  subscription,
  open,
  onOpenChangeAction,
}: DeleteForeverSubscriptionProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      hardDeleteSubscriptionApi(session!.user.id, subscription.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.INACTIVE_SUBSCRIPTIONS],
      });
      onOpenChangeAction(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10">
            <TriangleAlertIcon className="text-destructive size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {t("dashboard.deleteForever.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("dashboard.deleteForever.confirmLead")}{" "}
            <strong className="text-foreground">{subscription.name}</strong>
            {t("dashboard.deleteForever.confirmTail")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted/50 flex items-center gap-3 p-3">
          <ServiceIcon service={subscription.platform} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{subscription.name}</p>
            <p className="text-muted-foreground text-xs capitalize">
              {subscription.platform}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            {t("dashboard.deleteForever.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("dashboard.deleteForever.deleting")}
              </>
            ) : (
              <>
                <TriangleAlertIcon className="mr-2 size-4" />
                {t("dashboard.deleteForever.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
