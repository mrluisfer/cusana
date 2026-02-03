import { HugeiconsIcon } from "@hugeicons/react";
import { Logo } from "../logo";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="flex w-full items-center justify-between">
      <Button variant={"link"} render={<Link href={"/"} />}>
        <HugeiconsIcon icon={ArrowLeft01Icon} />
        Regresar
      </Button>
      <Logo />
    </header>
  );
}
