"use client";

import { Google } from "@/assets/icons/google";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Github } from "lucide-react";
import { useCallback, useState, type ComponentType, type SVGProps } from "react";

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
      aria-label={`Continuar con ${provider.label}`}
    >
      <provider.Icon aria-hidden="true" className="size-4" />
      <span>{provider.label}</span>
    </Button>
  );
}

export function OAuthButtons() {
  return (
    <>
      <div className="relative my-5">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="border-border/60 w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card/60 supports-[backdrop-filter]:bg-card/40 text-muted-foreground rounded-full px-3 py-0.5 backdrop-blur font-medium tracking-wide uppercase">
            O continúa con
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
