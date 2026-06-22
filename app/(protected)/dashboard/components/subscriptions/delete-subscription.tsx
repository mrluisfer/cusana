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
import { Loader2, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Subscription } from "./columns";

async function deleteSubscriptionApi(userId: string, subscriptionId: string) {
  const response = await fetch(
    `/api/${userId}/subscription?id=${subscriptionId}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Failed to delete the subscription");
  }

  return response.json();
}

type DeleteSubscriptionProps = {
  subscription: Subscription;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function DeleteSubscription({
  subscription,
  open,
  onOpenChangeAction,
}: DeleteSubscriptionProps) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteSubscriptionApi(session!.user.id, subscription.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUBSCRIPTIONS] });
      onOpenChangeAction(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10">
            <Trash2Icon className="text-destructive size-5" />
          </AlertDialogMedia>
          <AlertDialogTitle>{t("dashboard.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dashboard.delete.confirmLead")}{" "}
            <strong className="text-foreground">{subscription.name}</strong>
            {t("dashboard.delete.confirmTail")}
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
            {t("dashboard.delete.cancel")}
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
                {t("dashboard.delete.deleting")}
              </>
            ) : (
              <>
                <Trash2Icon className="mr-2 size-4" />
                {t("dashboard.delete.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
