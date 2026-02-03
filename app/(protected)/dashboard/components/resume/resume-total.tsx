"use client";

import { currencyAtom } from "@/atoms";
import { Loader } from "@/components/loader";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { CircleAlertIcon, WalletIcon } from "lucide-react";

// Función de fetch extraída para evitar closures
async function fetchResumeTotal(userId: string, currency: string) {
  const response = await fetch(`/api/${userId}/${currency}/resume-total`);
  if (!response.ok) {
    throw new Error("Failed to fetch total resume");
  }
  return response.json();
}

export function ResumeTotal() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const currency = useAtomValue(currencyAtom);

  const { data, isPending, error } = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, currency],
    queryFn: () => fetchResumeTotal(userId!, currency),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Item>
      <ItemMedia variant={"icon"}>
        <span className="relative inline-flex size-4 items-center justify-center">
          <CircleAlertIcon
            className={cn(
              "absolute size-4 transition-opacity",
              error ? "opacity-100" : "opacity-0",
            )}
          />
          <Loader
            className={cn(
              "absolute size-4 transition-opacity",
              isPending ? "opacity-100" : "opacity-0",
            )}
          />
          <WalletIcon
            className={cn(
              "absolute size-4 transition-opacity",
              data && !isPending && !error ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Resumen de gastos</ItemTitle>
        <ItemDescription className="relative min-h-[2.5rem]">
          <span
            className={cn(
              "absolute inset-0 transition-opacity",
              error ? "opacity-100" : "opacity-0",
            )}
          >
            {error?.message ?? "Ocurrió un error al cargar el total."}
          </span>
          <span
            className={cn(
              "absolute inset-0 transition-opacity",
              isPending ? "opacity-100" : "opacity-0",
            )}
          >
            Cargando total...
          </span>
          <span
            className={cn(
              "absolute inset-0 transition-opacity",
              data && !isPending && !error ? "opacity-100" : "opacity-0",
            )}
          >
            Total de{" "}
            <strong className="text-primary">
              {(parseFloat(data?.total) || 0).toLocaleString("es-MX")}{" "}
              {data?.currency}
            </strong>{" "}
            en tus suscripciones.
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
