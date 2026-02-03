"use client";
import { useSession } from "@/lib/auth-client";
import { Logo } from "../logo";
import { UserMenu } from "./user-menu";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between pt-4">
      <Logo />
      <div className="flex items-end justify-end gap-4">
        <p className="font-mono text-xl capitalize">
          Hola, {session?.user.name}
        </p>
        <UserMenu />
      </div>
    </header>
  );
}
