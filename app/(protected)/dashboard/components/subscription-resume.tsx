import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeCurrency } from "./resume/change-currency";
import { ResumeTotal } from "./resume/resume-total";
import { SubscriptionsActive } from "./resume/subscriptions-active";

export default async function SubscriptionResume() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mt-8">
      <Card className="min-w-[200px]">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground font-mono">
            Mis suscripciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SubscriptionsActive />
          <ResumeTotal />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChangeCurrency />
        </CardContent>
      </Card>
    </div>
  );
}
