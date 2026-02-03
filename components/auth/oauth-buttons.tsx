import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useCallback } from "react";

const providers = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
] as const;

type ProviderId = (typeof providers)[number]["id"];

// Handler de autenticación extraído para evitar closures
function handleOAuthSignIn(providerId: ProviderId) {
  signIn.social({
    provider: providerId,
    callbackURL: "/dashboard",
  });
}

// Componente individual de botón OAuth para evitar closures en el map
function OAuthButton({ provider }: { provider: (typeof providers)[number] }) {
  const handleClick = useCallback(
    () => handleOAuthSignIn(provider.id),
    [provider.id],
  );

  return (
    <Button type="button" variant="outline" onClick={handleClick}>
      {provider.label}
    </Button>
  );
}

export function OAuthButtons() {
  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-2">
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
