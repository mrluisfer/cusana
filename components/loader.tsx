import { cn } from "@/lib/utils";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

interface LoaderProps {
  size?: number;
  className?: string;
  message?: string;
}

/**
 * Generic Loader component for loading states (isPending, isLoading)
 */
export const Loader: React.FC<LoaderProps> = ({ className = "", message }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 items-center justify-center select-none",
        className,
      )}
      role="status"
    >
      <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      {message && <span className="text-sm text-gray-500">{message}</span>}
    </div>
  );
};
