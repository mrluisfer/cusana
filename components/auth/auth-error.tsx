// components/auth/auth-error.tsx
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";

export function AuthError({ message }: { message: string }) {
  if (!message) return null;

  return (
    <Alert>
      <AlertCircle className="size-4 shrink-0" />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
