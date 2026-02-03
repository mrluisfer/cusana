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
import { AlertCircle, CreditCard, Inbox, RefreshCw } from "lucide-react";

export default function SubscriptionTable() {
  const { data: session } = useSession();

  const { data, error, isPending, refetch, isRefetching } = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) {
        throw new Error("User ID is required");
      }

      const res = await fetch(`/api/${session.user.id}/subscription`);

      if (!res.ok) {
        throw new Error("No se pudieron cargar las suscripciones");
      }

      const json = await res.json();
      return json.subscriptions;
    },
    enabled: !!session?.user.id,
  });

  if (isPending) {
    return (
      <section className="space-y-6 mt-8">
        <TableSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 mt-8">
        <ErrorState
          message={error.message}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="space-y-6 mt-8">
        <EmptyState />
      </section>
    );
  }

  return (
    <section className="space-y-6 my-8 min-w-0">
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
        <div className="border-b bg-muted/50 p-4">
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
          {isRetrying ?
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          : <RefreshCw className="h-4 w-4 mr-2" />}
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto rounded-full bg-muted p-3 w-fit mb-2">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="text-lg">Sin suscripciones</CardTitle>
        <CardDescription>
          Aún no tienes ninguna suscripción registrada.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Agregar suscripción
        </Button>
      </CardContent>
    </Card>
  );
}
