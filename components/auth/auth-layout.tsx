import { AuthHeader } from "./auth-header";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  /** Subtítulo opcional debajo del título. */
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
      {/* Aurora backdrop — mismo lenguaje visual que la landing */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute top-[-10%] left-[10%] size-[40rem] rounded-full bg-primary/25 blur-[120px] motion-safe:animate-pulse" />
        <div className="absolute right-[10%] bottom-[-10%] size-[35rem] rounded-full bg-fuchsia-500/20 blur-[120px] [animation-delay:1.5s] motion-safe:animate-pulse" />
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
          }}
        />
      </div>

      <div className="container mx-auto w-full max-w-2xl px-4 pt-4">
        <AuthHeader />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/60 p-8 shadow-2xl shadow-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-card/40 md:p-10">
          <div className="mb-7 space-y-2 text-center">
            <h1 className="text-balance font-semibold text-2xl text-foreground tracking-tight md:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-pretty text-muted-foreground text-sm">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
