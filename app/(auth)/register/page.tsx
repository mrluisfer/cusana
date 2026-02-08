// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthError } from "@/components/auth/auth-error";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const { error } = await signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    if (error) {
      setError(error.message ?? "Error al crear cuenta");
      setIsPending(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <AuthInput label="Nombre" id="name" name="name" type="text" required />
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          required
        />
        <AuthInput
          label="Contraseña"
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
        />
        <p className="text-muted-foreground text-xs leading-relaxed">
          Al crear tu cuenta, aceptas nuestros{" "}
          <Link href="/terms" className="text-foreground underline">
            Términos de Servicio
          </Link>{" "}
          y{" "}
          <Link href="/privacy" className="text-foreground underline">
            Política de Privacidad
          </Link>
          .
        </p>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Button variant="link" className="px-1" render={<Link href="/login" />}>
          Inicia sesión
        </Button>
      </p>
    </AuthLayout>
  );
}
