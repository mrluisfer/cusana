// hooks/use-subscriptions.ts
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// Función de fetch extraída para evitar closures
async function fetchUserSubscriptions(userId: string) {
  const res = await fetch(`/api/${userId}/subscription`);
  if (!res.ok) throw new Error("No se pudieron cargar las suscripciones");
  const json = await res.json();
  return json.subscriptions;
}

// Query key constante para evitar recreación
const SUBSCRIPTIONS_QUERY_KEY = [QueryKeys.SUBSCRIPTIONS];

export const useSubscriptions = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, userId],
    queryFn: () => fetchUserSubscriptions(userId!),
    enabled: !!userId,
  });

  // useCallback para evitar recrear la función en cada render
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_QUERY_KEY }),
    [queryClient],
  );

  return {
    ...query,
    invalidate,
  };
};
