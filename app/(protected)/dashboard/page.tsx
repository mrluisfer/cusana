// app/dashboard/page.tsx
import { Container } from "@/components/container";
import Header from "@/components/dashboard/header";
import { getSessionOrRedirect } from "@/lib/get-session";
import SubscriptionTable from "./_components/subscriptions/table";
import SubscriptionResume from "./_components/subscription-resume";

export default async function DashboardPage() {
  const session = await getSessionOrRedirect();

  // return <h1>Hola, {session.user.name}</h1>;
  return (
    <Container>
      <Header />
      <SubscriptionResume />
      <SubscriptionTable />
    </Container>
  );
}
