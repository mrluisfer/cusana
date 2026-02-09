"use client";

import { signOut, useSession } from "@/lib/auth-client";
import Avatar from "boring-avatars";
import {
  LogOutIcon,
  MonitorIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
  const router = useRouter();
  const { data, isPending, error } = useSession();
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/login");
  }, [router]);

  const openProfile = useCallback(() => setProfileOpen(true), []);

  if (error) {
    return <ErrorStateInline message="Error al cargar el usuario" />;
  }

  if (isPending) {
    return <Loader message="Cargando información del usuario" />;
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
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuItem onClick={openProfile}>
              <UserIcon className="mr-2 size-4" />
              Perfil
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Apariencia - submenu funcional */}
          <DropdownMenuGroup>
            <DropdownMenuLabel>Preferencias</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PaletteIcon className="mr-2 size-4" />
                Apariencia
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="system">
                    <MonitorIcon className="mr-2 size-4" />
                    Sistema
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="light">
                    <SunIcon className="mr-2 size-4" />
                    Claro
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <MoonIcon className="mr-2 size-4" />
                    Oscuro
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Cerrar sesión */}
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOutIcon className="mr-2 size-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
};
