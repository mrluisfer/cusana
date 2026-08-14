import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type React from "react";
import { cn } from "@/lib/utils";

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
        "flex select-none flex-row items-center justify-center gap-2",
        className,
      )}
      role="status"
    >
      <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      {message && <span className="text-sm text-zinc-500">{message}</span>}
    </div>
  );
};
