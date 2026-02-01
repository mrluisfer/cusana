"use client";
import { useSession } from "@/lib/auth-client";
import Avatar from "boring-avatars";
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
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Appearance</DropdownMenuItem>
          <DropdownMenuItem>Privacy</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
