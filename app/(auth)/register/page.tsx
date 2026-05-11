"use client";

import { AuthError } from "@/components/auth/auth-error";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signUp } from "@/lib/auth-client";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const perks = [
  "Sin tarjeta de crédito",
  "Sin conexión bancaria",
  "Cancela cuando quieras",
];

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    await signUp.email(
      {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "Error al crear cuenta");
          setIsPending(false);
        },
      },
    );
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a controlar tus suscripciones en menos de un minuto."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthError message={error} />
        <AuthInput
          label="Nombre"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre"
          required
        />
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
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={8}
          required
          hint="Mínimo 8 caracteres."
        />

        <Button
          type="submit"
          className="group shadow-primary/20 w-full shadow-lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner aria-hidden="true" />
              Creando cuenta…
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <ul
          className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-1"
          aria-label="Beneficios de crear una cuenta"
        >
          {perks.map((perk) => (
            <li
              key={perk}
              className="text-muted-foreground flex items-center gap-1 text-xs"
            >
              <span className="bg-primary/15 text-primary inline-flex size-3.5 items-center justify-center rounded-full">
                <Check className="size-2.5" aria-hidden="true" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          Al crear tu cuenta, aceptas nuestros{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-4"
          >
            Términos
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            Privacidad
          </Link>
          .
        </p>
      </form>

      <OAuthButtons />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
