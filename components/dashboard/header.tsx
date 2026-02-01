import React from "react";
import { Logo } from "../logo";
import Avatar from "boring-avatars";
import { UserMenu } from "./user-menu";

export default function Header() {
  return (
    <header className="pt-4 flex items-center justify-between">
      <Logo />

      <UserMenu />
    </header>
  );
}
