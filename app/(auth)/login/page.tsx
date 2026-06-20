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
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
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
          setError(ctx.error.message ?? t("auth.login.error"));
          setIsPending(false);
        },
      },
    );
  }

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthError message={error} />
        <AuthInput
          label={t("auth.login.emailLabel")}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
        />
        <AuthInput
          label={t("auth.login.passwordLabel")}
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
              {t("auth.login.forgotPassword")}
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
              {t("auth.login.submitting")}
            </>
          ) : (
            <>
              {t("auth.login.submit")}
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
        {t("auth.login.noAccount")}{" "}
        <Link
          href="/register"
          className="text-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.login.registerCta")}
        </Link>
      </p>
    </AuthLayout>
  );
}
