// components/ui/error-state.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

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
  title,
  message,
  icon,
  onRetry,
  retryLabel,
  showHomeButton = false,
  homeHref = "/",
  homeLabel,
  showBackButton = false,
  backHref,
  backLabel,
  action,
  className,
  variant = "default",
}: ErrorStateProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("errorState.title");
  const resolvedMessage = message ?? t("errorState.message");
  const resolvedRetryLabel = retryLabel ?? t("errorState.retry");
  const resolvedHomeLabel = homeLabel ?? t("errorState.home");
  const resolvedBackLabel = backLabel ?? t("errorState.back");
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        variantStyles[variant],
        className,
      )}
    >
      {/* Icono */}
      <div className="bg-destructive/10 mb-4 flex size-12 items-center justify-center rounded-full">
        {icon ?? <AlertCircle className="text-destructive size-6" />}
      </div>

      {/* Texto */}
      <h3 className="text-foreground mb-1 text-lg font-semibold">
        {resolvedTitle}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        {resolvedMessage}
      </p>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm">
            <RefreshCw className="mr-2 size-4" />
            {resolvedRetryLabel}
          </Button>
        )}

        {showBackButton && backHref && (
          <Button variant="outline" size="sm" render={<Link href={backHref} />}>
            <ArrowLeft className="mr-2 size-4" />
            {resolvedBackLabel}
          </Button>
        )}

        {showHomeButton && (
          <Button variant="outline" size="sm" render={<Link href={homeHref} />}>
            <Home className="mr-2 size-4" />
            {resolvedHomeLabel}
          </Button>
        )}

        {action}
      </div>
    </div>
  );
}

// Variante para usar en cards/tablas
export function ErrorStateInline({
  message,
  onRetry,
  className,
}: Pick<ErrorStateProps, "message" | "onRetry" | "className">) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "bg-destructive/5 border-destructive/20 flex items-center justify-between gap-4 rounded-lg border p-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="text-destructive size-5 shrink-0" />
        <p className="text-destructive text-sm">
          {message ?? t("errorState.inlineMessage")}
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="shrink-0"
        >
          <RefreshCw className="mr-2 size-4" />
          {t("errorState.retry")}
        </Button>
      )}
    </div>
  );
}
