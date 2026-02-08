"use client";

import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { subscriptionsColumns } from "./columns";
import { DataTable } from "./data-table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryKeys } from "@/constants/query-keys";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { AddSubscription } from "./actions/add-subscription";

// Función de fetch extraída para evitar closures
async function fetchSubscriptions(userId: string) {
  const res = await fetch(`/api/${userId}/subscription`);

  if (!res.ok) {
    throw new Error("No se pudieron cargar las suscripciones");
  }

  const json = await res.json();
  return json.subscriptions;
}

export default function SubscriptionTable() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data, error, isPending, refetch, isRefetching } = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, userId],
    queryFn: () => fetchSubscriptions(userId!),
    enabled: !!userId,
  });

  if (isPending) {
    return (
      <section className="mt-8 space-y-6">
        <TableSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 space-y-6">
        <ErrorState
          message={error.message}
          onRetry={refetch}
          isRetrying={isRefetching}
        />
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="mt-8 space-y-6">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="my-8 min-w-0 space-y-6">
      <DataTable columns={subscriptionsColumns} data={data} />
    </section>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <Skeleton className="h-8 w-full md:w-48" />
        <div className="flex items-center gap-2 md:justify-self-end">
          <Skeleton className="h-9 w-full sm:w-32" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="bg-muted/50 border-b p-4">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>

        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="border-b p-4 last:border-b-0">
            <div className="flex gap-4">
              {[...Array(4)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error al cargar suscripciones</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2 text-center">
        <div className="bg-muted mx-auto mb-2 w-fit rounded-full p-3">
          <Inbox className="text-muted-foreground h-6 w-6" />
        </div>
        <CardTitle className="text-lg">Sin suscripciones</CardTitle>
        <CardDescription>
          Aún no tienes ninguna suscripción registrada.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <AddSubscription />
      </CardContent>
    </Card>
  );
}
