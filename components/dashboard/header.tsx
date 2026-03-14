"use client";
import { useSession } from "@/lib/auth-client";
import { Logo } from "../logo";
import { UserMenu } from "./user-menu";

export default function Header() {
  const { data: session } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <header className="flex items-center justify-between py-5">
      <div className="flex items-center gap-4">
        <Logo />
        <div className="bg-border hidden h-6 w-px sm:block" />
        <p className="text-muted-foreground hidden text-sm sm:block">
          {getGreeting()},{" "}
          <span className="text-foreground font-medium capitalize">
            {session?.user.name}
          </span>
        </p>
      </div>
      <UserMenu />
    </header>
  );
}
