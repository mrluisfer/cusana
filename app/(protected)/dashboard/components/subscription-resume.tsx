import { BillingCalendar } from "./resume/billing-calendar";
import { HeroSummary } from "./resume/hero-summary";
import { MonthlyTrend } from "./resume/monthly-trend";
import { QuickActions } from "./resume/quick-actions";
import { SpendingDistribution } from "./resume/spending-distribution";
import { UpcomingPayments } from "./resume/upcoming-payments";

export default async function SubscriptionResume() {
  return (
    <div className="mt-4 mb-12 space-y-6">
      <HeroSummary />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="bg-card rounded-2xl border p-4 shadow-sm sm:p-6">
          <BillingCalendar />
        </div>
        <div className="space-y-4">
          <UpcomingPayments />
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <MonthlyTrend />
        <SpendingDistribution />
      </div>
    </div>
  );
}
