// app/dashboard/page.tsx
import { Container } from "@/components/container";
import Header from "@/components/dashboard/header";
import { ErrorState } from "@/components/error-state";
import { getSessionOrRedirect } from "@/lib/get-session";
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
      <SubscriptionTable />
      <SubscriptionResume />
    </Container>
  );
}
