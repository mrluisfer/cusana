"use client";

import { signOut, useSession } from "@/lib/auth-client";
import Avatar from "boring-avatars";
import { locales, localeLabels } from "@/lib/i18n/settings";
import { useLanguage } from "@/lib/i18n/use-language";
import {
  FileTextIcon,
  LanguagesIcon,
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  ShieldCheckIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorStateInline } from "../error-state";
import { Loader } from "../loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ProfileDialog } from "./profile-dialog";

export const UserMenu = () => {
  const { push } = useRouter();
  const { data, isPending, error } = useSession();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    await signOut();
    push("/login");
  }, [push]);

  const openProfile = useCallback(() => setProfileOpen(true), []);

  if (error) {
    return <ErrorStateInline message={t("userMenu.loadUserError")} />;
  }

  if (isPending) {
    return <Loader message={t("userMenu.loadingUser")} />;
  }

  const user = data?.user;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:ring-ring rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
          <Avatar name={user?.name || "User"} variant="beam" size={32} square />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Profile header */}
          <div className="px-2 py-2.5">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={user?.name || "User"}
                variant="beam"
                size={32}
                square
              />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {user?.name}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Cuenta */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("userMenu.myAccount")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={openProfile}>
              <UserIcon className="mr-2 size-4" />
              {t("userMenu.profile")}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Preferencias - submenus funcionales */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("userMenu.preferences")}</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PaletteIcon className="mr-2 size-4" />
                {t("userMenu.appearance")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">
                    <MonitorIcon className="mr-2 size-4" />
                    {t("theme.system")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">
                    <SunIcon className="mr-2 size-4" />
                    {t("theme.light")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <MoonIcon className="mr-2 size-4" />
                    {t("theme.dark")}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <LanguagesIcon className="mr-2 size-4" />
                {t("language.label")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={language}
                  onValueChange={(value) => setLanguage(value as typeof language)}
                >
                  {locales.map((locale) => (
                    <DropdownMenuRadioItem key={locale} value={locale}>
                      {localeLabels[locale]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Legal */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>{t("userMenu.legal")}</DropdownMenuLabel>
            <DropdownMenuItem render={<Link href="/privacy" />}>
              <ShieldCheckIcon className="mr-2 size-4" />
              {t("userMenu.privacy")}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/terms" />}>
              <FileTextIcon className="mr-2 size-4" />
              {t("userMenu.terms")}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Cerrar sesión */}
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOutIcon className="mr-2 size-4" />
            {t("userMenu.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
};
