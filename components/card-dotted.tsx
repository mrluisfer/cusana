import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardDottedProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function CardDotted({
  children,
  className,
  containerClassName,
  ...props
}: CardDottedProps) {
  return (
    <div
      data-slot="example"
      className={cn(
        "mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none",
        containerClassName,
      )}
      {...props}
    >
      <div
        data-slot="example-content"
        className={cn(
          "bg-background text-foreground flex min-w-0 flex-1 flex-col items-start gap-6 border border-dashed p-4 sm:p-6 *:[div:not([class*='w-'])]:w-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
