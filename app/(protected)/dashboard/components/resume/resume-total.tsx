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
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { CircleAlertIcon, WalletIcon } from "lucide-react";

export function ResumeTotal() {
  const { data: session } = useSession();

  const currency = useAtomValue(currencyAtom);

  const { data, isPending, error } = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, currency], // ← Agregar currency aquí
    queryFn: async () => {
      const response = await fetch(
        `/api/${session!.user.id}/${currency}/resume-total`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch total resume");
      }
      return response.json();
    },
    enabled: !!session?.user.id, // ← Evita ejecutar sin session
    staleTime: 1000 * 60 * 5, // ← Opcional: 5 min cache para no refetchear innecesariamente
  });

  return (
    <Item>
      <ItemMedia variant={"icon"}>
        {error ?
          <CircleAlertIcon className="size-4" />
        : null}
        {isPending ?
          <Loader className="size-4" />
        : null}
        {data && !isPending && !error ?
          <WalletIcon className="size-4" />
        : null}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Resumen de gastos</ItemTitle>
        <ItemDescription>
          {error || isPending ?
            <>
              {error ?
                <>{error.message}</>
              : null}
              {isPending ?
                <>Cargando total...</>
              : null}
            </>
          : null}
          {data && !isPending && !error ?
            <>
              Total de{" "}
              <strong className="text-primary">
                {Number.parseInt(data.total, 10)} {data.currency}
              </strong>{" "}
              en tus suscripciones.
            </>
          : null}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
