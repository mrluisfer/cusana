import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto min-h-screen max-w-4xl px-4">
      <header className="flex items-center justify-between py-6">
        <Button variant="link" render={<Link href="/" />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} />
          Inicio
        </Button>
        <Logo />
      </header>

      <main className="pb-16">{children}</main>

      <footer className="border-border border-t py-8">
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <nav className="flex gap-6" aria-label="Legal">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Términos
            </Link>
          </nav>
          <p>&copy; {new Date().getFullYear()} Cusana</p>
        </div>
      </footer>
    </div>
  );
}
