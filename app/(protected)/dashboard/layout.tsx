import { AiChatLayout } from "@/components/ai-chat/ai-chat-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen">
      {/* Aurora backdrop — mismo lenguaje visual que landing y auth.
          Fixed: no se mueve con scroll, no afecta layout interno. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="bg-primary/20 absolute top-[-15%] left-[5%] size-[40rem] rounded-full blur-[120px] motion-safe:animate-pulse" />
        <div className="absolute top-[30%] right-[-10%] size-[35rem] rounded-full bg-fuchsia-500/15 blur-[120px] [animation-delay:1.5s] motion-safe:animate-pulse" />
        <div className="absolute bottom-[-10%] left-[20%] size-[30rem] rounded-full bg-sky-500/15 blur-[120px] [animation-delay:3s] motion-safe:animate-pulse" />
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* Skip link para teclado / screen readers */}
      <a
        href="#dashboard-main"
        className="bg-primary text-primary-foreground focus-visible:ring-ring sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:ring-2 focus-visible:outline-none"
      >
        Saltar al contenido
      </a>

      <AiChatLayout>{children}</AiChatLayout>
    </div>
  );
}
