import { BillingCalendar } from "./resume/billing-calendar";
import { MonthlyTrend } from "./resume/monthly-trend";
import { QuickActions } from "./resume/quick-actions";
import { SpendingDistribution } from "./resume/spending-distribution";
import { StatsCards } from "./resume/stats-cards";
import { UpcomingPayments } from "./resume/upcoming-payments";

export default async function SubscriptionResume() {
  return (
    <div className="space-y-6 mt-8 mb-12">
      {/* Sección de título */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Resumen de Suscripciones
        </h2>
        <p className="text-muted-foreground text-sm">
          Visualiza y gestiona todos tus gastos recurrentes en un solo lugar.
        </p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      <StatsCards />

      {/* Grid principal con componentes detallados */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
        {/* Columna izquierda - Próximos pagos y distribución */}
        <div className="space-y-6 min-w-0">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 min-w-0">
            <UpcomingPayments />
            <SpendingDistribution />
          </div>
          <MonthlyTrend />
        </div>

        {/* Columna derecha - Calendario y acciones */}
        <div className="space-y-6 min-w-0">
          <BillingCalendar />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
