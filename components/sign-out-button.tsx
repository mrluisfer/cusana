// components/sign-out-button.tsx
"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <Button onClick={handleSignOut} variant={"destructive"}>
      Cerrar sesión
    </Button>
  );
}
