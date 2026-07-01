"use client";

import { ServiceIcon } from "@/components/dashboard/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/utils/format-currency";
import { useQuery } from "@tanstack/react-query";
import { Archive, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Subscription } from "./columns";
import { DeleteForeverSubscription } from "./actions/delete-forever-subscription";
import { ReactivateSubscription } from "./actions/reactivate-subscription";

async function fetchInactiveSubscriptions(userId: string) {
  const res = await fetch(`/api/${userId}/subscription?status=inactive`);

  if (!res.ok) {
    throw new Error("Failed to load inactive subscriptions");
  }

  const json = await res.json();
  return json.subscriptions as Subscription[];
}

export default function InactiveSubscriptionsTable() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [target, setTarget] = useState<Subscription | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: [QueryKeys.INACTIVE_SUBSCRIPTIONS, userId],
    queryFn: () => fetchInactiveSubscriptions(userId!),
    enabled: !!userId,
  });

  // Ayuda visual únicamente: si no hay inactivas, no mostramos nada.
  if (isPending || !data || data.length === 0) {
    return null;
  }

  const onReactivate = (subscription: Subscription) => {
    setTarget(subscription);
    setDialogOpen(true);
  };

  const onDeleteForever = (subscription: Subscription) => {
    setDeleteTarget(subscription);
    setDeleteOpen(true);
  };

  return (
    <section className="mt-8 min-w-0 space-y-4">
      <Card className="bg-muted/20 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="bg-muted text-muted-foreground rounded-md p-1.5">
              <Archive className="size-4" />
            </span>
            <div>
              <CardTitle className="text-base">
                {t("dashboard.inactive.title")}
              </CardTitle>
              <CardDescription>
                {t("dashboard.inactive.description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="border-border/60 overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t("dashboard.columns.service")}
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t("dashboard.columns.price")}
                  </TableHead>
                  <TableHead className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t("dashboard.inactive.status")}
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold tracking-wider uppercase">
                    <span className="sr-only">
                      {t("dashboard.columns.actions")}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((subscription) => (
                  <TableRow
                    key={subscription.id}
                    className="group opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <ServiceIcon
                          service={subscription.platform}
                          size="xs"
                        />
                        <div className="flex flex-col">
                          <span className="text-foreground font-medium">
                            {subscription.name}
                          </span>
                          <span className="text-muted-foreground text-xs capitalize">
                            {subscription.platform}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-muted-foreground text-sm tabular-nums line-through">
                        {formatCurrency(
                          subscription.price,
                          subscription.currency,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className="text-muted-foreground border-dashed"
                      >
                        {t("dashboard.inactive.inactiveBadge")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReactivate(subscription)}
                        >
                          <RotateCcwIcon className="mr-2 size-4" />
                          {t("dashboard.inactive.reactivate")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteForever(subscription)}
                        >
                          <Trash2Icon className="mr-2 size-4" />
                          {t("dashboard.inactive.deleteForever")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {target && (
        <ReactivateSubscription
          subscription={target}
          open={dialogOpen}
          onOpenChangeAction={setDialogOpen}
        />
      )}

      {deleteTarget && (
        <DeleteForeverSubscription
          subscription={deleteTarget}
          open={deleteOpen}
          onOpenChangeAction={setDeleteOpen}
        />
      )}
    </section>
  );
}
