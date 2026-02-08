// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthError } from "@/components/auth/auth-error";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
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
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message ?? "Error al iniciar sesión");
          setIsPending(false);
        },
      },
    );
  }

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="tu@email.com"
          required
        />
        <AuthInput
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>

      <OAuthButtons />

      <p className="text-muted-foreground text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Button
          variant="link"
          className="px-1"
          render={<Link href="/register" />}
        >
          Regístrate
        </Button>
      </p>
    </AuthLayout>
  );
}
