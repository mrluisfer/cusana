"use client";
import { useTranslation } from "react-i18next";
import { useSession } from "@/lib/auth-client";
import { CommandMenuButton } from "../command-palette";
import { LanguageToggle } from "../language-toggle";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { UserMenu } from "./user-menu";

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
        <div className="hidden h-6 w-px bg-border sm:block" />
        <p className="hidden text-muted-foreground text-sm sm:block">
          {getGreeting()},{" "}
          <span className="font-medium text-foreground capitalize">
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
