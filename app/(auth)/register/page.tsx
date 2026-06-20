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
import { useTranslation } from "react-i18next";

const perkIds = ["noCard", "noBank", "cancelAnytime"] as const;

export default function RegisterPage() {
  const { t } = useTranslation();
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
          setError(ctx.error.message ?? t("auth.register.error"));
          setIsPending(false);
        },
      },
    );
  }

  return (
    <AuthLayout
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthError message={error} />
        <AuthInput
          label={t("auth.register.nameLabel")}
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t("auth.register.namePlaceholder")}
          required
        />
        <AuthInput
          label={t("auth.register.emailLabel")}
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          required
        />
        <AuthInput
          label={t("auth.register.passwordLabel")}
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={8}
          required
          hint={t("auth.register.passwordHint")}
        />

        <Button
          type="submit"
          className="group shadow-primary/20 w-full shadow-lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner aria-hidden="true" />
              {t("auth.register.submitting")}
            </>
          ) : (
            <>
              {t("auth.register.submit")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <ul
          className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-1"
          aria-label={t("auth.register.perksLabel")}
        >
          {perkIds.map((perk) => (
            <li
              key={perk}
              className="text-muted-foreground flex items-center gap-1 text-xs"
            >
              <span className="bg-primary/15 text-primary inline-flex size-3.5 items-center justify-center rounded-full">
                <Check className="size-2.5" aria-hidden="true" />
              </span>
              {t(`auth.register.perks.${perk}` as const)}
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          {t("auth.register.termsLead")}{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-4"
          >
            {t("auth.register.termsLink")}
          </Link>{" "}
          {t("auth.register.and")}{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            {t("auth.register.privacyLink")}
          </Link>
          .
        </p>
      </form>

      <OAuthButtons />

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {t("auth.register.haveAccount")}{" "}
        <Link
          href="/login"
          className="text-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
        >
          {t("auth.register.loginCta")}
        </Link>
      </p>
    </AuthLayout>
  );
}
