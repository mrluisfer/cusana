"use client";
import { signOut, useSession } from "@/lib/auth-client";
import Avatar from "boring-avatars";
import { LogOutIcon } from "lucide-react";
import { ErrorStateInline } from "../error-state";
import { Loader } from "../loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const UserMenu = () => {
  const { data, isPending, error } = useSession();

  function handleSignOut() {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  }

  if (error) {
    return <ErrorStateInline message="Error al cargar el usuario" />;
  }

  if (isPending) {
    return <Loader message="Cargando información del usuario" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar name={data?.user?.name || "User"} variant="beam" square />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>Ajustes</DropdownMenuItem>
          <DropdownMenuItem>Apariencia</DropdownMenuItem>
          <DropdownMenuItem>Privacidad</DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOutIcon className="mr-2 size-4" />
          Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
