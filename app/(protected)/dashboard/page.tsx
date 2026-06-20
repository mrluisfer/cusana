import { Container } from "@/components/container";
import Header from "@/components/dashboard/header";
import { ErrorState } from "@/components/error-state";
import { getSessionOrRedirect } from "@/lib/get-session";
import { Suspense } from "react";
import {
  DashboardSectionHeader,
  SectionFallback,
} from "./components/section-header";
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
          <DashboardSectionHeader id="resume-heading" section="resume" />
          <Suspense fallback={<SectionFallback />}>
            <SubscriptionResume />
          </Suspense>
        </section>

        <section aria-labelledby="subscriptions-heading" className="scroll-mt-6">
          <DashboardSectionHeader id="subscriptions-heading" section="detail" />
          <Suspense fallback={<SectionFallback />}>
            <SubscriptionTable />
          </Suspense>
        </section>
      </main>
    </Container>
  );
}
