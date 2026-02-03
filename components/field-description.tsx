import { cn } from "@/lib/utils";

export function FieldDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-muted-foreground text-xs", className)} {...props}>
      {children}
    </p>
  );
}
