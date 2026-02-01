import { Logo } from "../logo";
import { UserMenu } from "./user-menu";

export default function Header() {
  return (
    <header className="pt-4 flex items-center justify-between">
      <Logo />

      <UserMenu />
    </header>
  );
}
