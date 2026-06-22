"use client";
import { useSession } from "@/lib/auth-client";
import { useTranslation } from "react-i18next";
import { CommandMenuButton } from "../command-palette";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { UserMenu } from "./user-menu";
import { LanguageToggle } from "../language-toggle";

export default function Header() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("nav.greetingMorning");
    if (hour < 18) return t("nav.greetingAfternoon");
    return t("nav.greetingEvening");
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
      <div className="flex items-center gap-2">
        <CommandMenuButton />
        <LanguageToggle variant="outline" />
        <ThemeToggle variant="outline" />
        <UserMenu />
      </div>
    </header>
  );
}
