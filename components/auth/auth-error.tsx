import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

export function AuthError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      role="alert"
      aria-live="polite"
      className="border-destructive/30 bg-destructive/5"
    >
      <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
