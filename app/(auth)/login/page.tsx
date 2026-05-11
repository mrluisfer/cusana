"use client";

import { AuthError } from "@/components/auth/auth-error";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    await signIn.email(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "Error al iniciar sesión");
          setIsPending(false);
        },
      },
    );
  }

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para ver tus suscripciones."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthError message={error} />
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
        />
        <AuthInput
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          trailingLabel={
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-primary text-xs underline-offset-4 transition-colors hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        />
        <Button
          type="submit"
          className="group shadow-primary/20 w-full shadow-lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner aria-hidden="true" />
              Iniciando sesión…
            </>
          ) : (
            <>
              Iniciar sesión
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>
      </form>

      <OAuthButtons />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          Regístrate gratis
        </Link>
      </p>
    </AuthLayout>
  );
}
