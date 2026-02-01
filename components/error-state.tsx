// components/ui/error-state.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;

  // Acciones
  onRetry?: () => void;
  retryLabel?: string;

  showHomeButton?: boolean;
  homeHref?: string;
  homeLabel?: string;

  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;

  // Acción custom
  action?: React.ReactNode;

  // Estilos
  className?: string;
  variant?: "default" | "compact" | "full";
}

const variantStyles = {
  default: "py-12",
  compact: "py-6",
  full: "min-h-[400px]",
};

export function ErrorState({
  title = "Algo salió mal",
  message = "No pudimos cargar la información. Por favor intenta de nuevo.",
  icon,
  onRetry,
  retryLabel = "Reintentar",
  showHomeButton = false,
  homeHref = "/",
  homeLabel = "Ir al inicio",
  showBackButton = false,
  backHref,
  backLabel = "Volver",
  action,
  className,
  variant = "default",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-4",
        variantStyles[variant],
        className,
      )}
    >
      {/* Icono */}
      <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        {icon ?? <AlertCircle className="size-6 text-destructive" />}
      </div>

      {/* Texto */}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm">
            <RefreshCw className="mr-2 size-4" />
            {retryLabel}
          </Button>
        )}

        {showBackButton && backHref && (
          <Button variant="outline" size="sm" render={<Link href={backHref} />}>
            <ArrowLeft className="mr-2 size-4" />
            {backLabel}
          </Button>
        )}

        {showHomeButton && (
          <Button variant="outline" size="sm" render={<Link href={homeHref} />}>
            <Home className="mr-2 size-4" />
            {homeLabel}
          </Button>
        )}

        {action}
      </div>
    </div>
  );
}

// Variante para usar en cards/tablas
export function ErrorStateInline({
  message = "Error al cargar",
  onRetry,
  className,
}: Pick<ErrorStateProps, "message" | "onRetry" | "className">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0" />
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          <RefreshCw className="mr-2 size-4" />
          Reintentar
        </Button>
      )}
    </div>
  );
}
