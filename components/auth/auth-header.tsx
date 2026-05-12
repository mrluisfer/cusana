import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

export function AuthHeader() {
  return (
    <header
      className="border-border/60 bg-background/60 supports-[backdrop-filter]:bg-background/40 sticky top-4 z-40 flex w-full items-center justify-between rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur-xl"
    >
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" render={<Link href="/" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} aria-hidden="true" />
          <span className="hidden sm:inline">Regresar</span>
        </Button>
      </div>
    </header>
  );
}
