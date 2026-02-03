"use client";
import { useSession } from "@/lib/auth-client";
import { Logo } from "../logo";
import { UserMenu } from "./user-menu";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="pt-4 flex items-center justify-between">
      <Logo />
      <div className="flex items-end justify-end gap-4">
        <p className="text-xl capitalize font-mono">
          Hola, {session?.user.name}
        </p>
        <UserMenu />
      </div>
    </header>
  );
}
