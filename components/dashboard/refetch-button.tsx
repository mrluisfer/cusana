"use client";

import { QueryKeys } from "@/constants/query-keys";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { Button } from "../ui/button";

export const RefetchButton = () => {
  const queryClient = useQueryClient();

  // Detecta si ESA query específica está fetching
  const isFetching = useIsFetching({ queryKey: [QueryKeys.SUBSCRIPTIONS] }) > 0;

  const handleRefetch = () => {
    queryClient.invalidateQueries({ queryKey: [QueryKeys.SUBSCRIPTIONS] });
  };

  return (
    <Button variant="ghost" onClick={handleRefetch} disabled={isFetching}>
      <RefreshCwIcon
        className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
      />
      Refrescar datos
    </Button>
  );
};
