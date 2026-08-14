"use client";

import {
  type ComponentType,
  type SVGProps,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Github } from "@/assets/icons/github";
import { Google } from "@/assets/icons/google";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

type Provider = {
  id: "google" | "github";
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const providers: Provider[] = [
  { id: "google", label: "Google", Icon: Google },
  { id: "github", label: "GitHub", Icon: Github },
];

function OAuthButton({ provider }: { provider: Provider }) {
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);

  const signInWithProvider = useCallback(() => {
    setIsPending(true);
    signIn.social({ provider: provider.id, callbackURL: "/dashboard" });
  }, [provider.id]);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={signInWithProvider}
      disabled={isPending}
      className="bg-background/40 backdrop-blur transition-colors"
      aria-label={t("auth.oauth.continueWith", { provider: provider.label })}
    >
      <provider.Icon aria-hidden="true" className="size-4" />
      <span>{provider.label}</span>
    </Button>
  );
}

export function OAuthButtons() {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative my-5">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-border/60 border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="rounded-full bg-card/60 px-3 py-0.5 font-medium text-muted-foreground uppercase tracking-wide backdrop-blur supports-[backdrop-filter]:bg-card/40">
            {t("auth.oauth.divider")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <OAuthButton key={provider.id} provider={provider} />
        ))}
      </div>
    </>
  );
}
