// hooks/use-subscriptions.ts
import { QueryKeys } from "@/constants/query-keys";
import { useSession } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubscriptions = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKeys.SUBSCRIPTIONS, session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) throw new Error("User ID is required");
      const res = await fetch(`/api/${session.user.id}/subscription`);
      if (!res.ok) throw new Error("No se pudieron cargar las suscripciones");
      const json = await res.json();
      return json.subscriptions;
    },
    enabled: !!session?.user.id,
  });

  return {
    ...query,
    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUBSCRIPTIONS] }),
  };
};
