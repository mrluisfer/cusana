import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const providers = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
] as const;

export function OAuthButtons() {
  return (
    <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            onClick={() =>
              signIn.social({
                provider: provider.id,
                callbackURL: "/dashboard",
              })
            }
          >
            {provider.label}
          </Button>
        ))}
      </div>
    </>
  );
}
