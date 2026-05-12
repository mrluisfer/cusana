import { Container } from "@/components/container";
import Header from "@/components/dashboard/header";
import { ErrorState } from "@/components/error-state";
import { Spinner } from "@/components/ui/spinner";
import { getSessionOrRedirect } from "@/lib/get-session";
import { Suspense } from "react";
import SubscriptionResume from "./components/subscription-resume";
import SubscriptionTable from "./components/subscriptions/table";

export default async function DashboardPage() {
  const session = await getSessionOrRedirect();

  if (!session.user.id) {
    return <ErrorState message="User ID is missing" />;
  }

  return (
    <Container>
      <Header />

      <main
        id="dashboard-main"
        className="space-y-12 pb-16 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:duration-500"
      >
        <section aria-labelledby="resume-heading" className="scroll-mt-6">
          <SectionHeader
            id="resume-heading"
            eyebrow="Resumen"
            title="Tu mes en un vistazo"
            description="Gasto efectivo, próximos cobros y distribución por servicio."
          />
          <Suspense fallback={<SectionFallback />}>
            <SubscriptionResume />
          </Suspense>
        </section>

        <section aria-labelledby="subscriptions-heading" className="scroll-mt-6">
          <SectionHeader
            id="subscriptions-heading"
            eyebrow="Detalle"
            title="Todas tus suscripciones"
            description="Administra, edita y filtra cada servicio recurrente."
          />
          <Suspense fallback={<SectionFallback />}>
            <SubscriptionTable />
          </Suspense>
        </section>
      </main>
    </Container>
  );
}

function SectionHeader({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-5 flex flex-col gap-1">
      <p className="text-primary text-xs font-semibold tracking-wider uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="text-foreground text-xl font-semibold tracking-tight text-balance md:text-2xl"
      >
        {title}
      </h2>
      <p className="text-muted-foreground text-sm text-pretty">{description}</p>
    </header>
  );
}

function SectionFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-border/60 bg-card/40 flex min-h-40 items-center justify-center rounded-2xl border backdrop-blur-xl"
    >
      <Spinner className="text-muted-foreground size-5" />
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
