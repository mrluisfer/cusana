"use client";

import { QueryKeys } from "@/constants/query-keys";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Query key constante para evitar recreación
const SUBSCRIPTIONS_QUERY_KEY = { queryKey: [QueryKeys.SUBSCRIPTIONS] };

export const RefetchButton = () => {
  const queryClient = useQueryClient();

  // Detecta si ESA query específica está fetching
  const isFetching = useIsFetching(SUBSCRIPTIONS_QUERY_KEY) > 0;

  // useCallback para evitar recrear la función en cada render
  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries(SUBSCRIPTIONS_QUERY_KEY);
  }, [queryClient]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefetch}
            disabled={isFetching}
          />
        }
      >
        <RefreshCwIcon
          className={`size-4 ${isFetching ? "animate-spin" : ""}`}
        />
        <span className="sr-only">Refrescar datos</span>
      </TooltipTrigger>
      <TooltipContent>Refrescar datos</TooltipContent>
    </Tooltip>
  );
};
