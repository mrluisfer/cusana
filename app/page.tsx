"use client";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import PhoneMockup from "@/components/landing/phone-mockup";
import { FlowerIcon, Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Bell,
  Check,
  CreditCard,
  PieChart,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Plus,
    title: "Agrega fácilmente",
    description:
      "Añade tus suscripciones en segundos con detección automática de servicios populares.",
  },
  {
    icon: Bell,
    title: "Recordatorios inteligentes",
    description:
      "Recibe alertas antes de cada cobro para que nunca te sorprenda un cargo.",
  },
  {
    icon: PieChart,
    title: "Insights claros",
    description:
      "Visualiza cuánto gastas por categoría y encuentra suscripciones que no usas.",
  },
  {
    icon: CreditCard,
    title: "Métodos de pago",
    description:
      "Organiza qué tarjeta usa cada servicio y mantén todo bajo control.",
  },
];

const stats = [
  { value: "$2.4M+", label: "Ahorrados por usuarios" },
  { value: "50K+", label: "Suscripciones tracked" },
  { value: "12K+", label: "Usuarios activos" },
  { value: "4.9★", label: "Rating en App Store" },
];

const benefits = [
  "Sin tarjeta de crédito",
  "Cancela cuando quieras",
  "Soporte 24/7",
];

export default function LandingPage() {
  return (
    <main className="from-background to-muted/30 container mx-auto min-h-screen max-w-6xl bg-linear-to-b px-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <Logo />

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" render={<Link href="/login" />}>
            Iniciar sesión
          </Button>
          <Button render={<Link href="/register" />}>
            Crear cuenta
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left - Copy */}
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="gap-1.5 px-3 py-1.5 text-sm font-medium"
            >
              <Sparkles className="size-3.5" />
              Nuevo: Insights con IA
            </Badge>

            <h1 className="text-foreground text-4xl leading-[1.1] font-bold tracking-tight md:text-5xl lg:text-6xl">
              Tus suscripciones,
              <span className="text-primary"> bajo control.</span>
            </h1>

            <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
              Deja de perder dinero en servicios que olvidas. Cusana te ayuda a
              visualizar, organizar y optimizar todos tus pagos recurrentes.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                size="lg"
                className="px-6 text-base"
                render={<Link href="/register" />}
              >
                Comenzar gratis
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-6 text-base">
                Ver demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="text-muted-foreground flex items-center gap-1.5 text-sm"
                >
                  <Check className="text-primary size-4" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Right - App Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Floating service icons */}
            <ServiceIcon
              service="netflix"
              className="animate-float absolute top-8 -left-4"
            />
            <ServiceIcon
              service="spotify"
              className="animate-float-delayed absolute top-20 -right-24"
            />
            <ServiceIcon
              service="disney"
              className="animate-float absolute bottom-12 left-8"
            />

            {/* Phone mockup */}
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="border-border bg-card/50 rounded-2xl border p-8 backdrop-blur-sm md:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${
                  index < stats.length - 1 ? "md:border-border md:border-r" : ""
                }`}
              >
                <p className="text-foreground text-3xl font-bold md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1.5 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-4">
            Características
          </Badge>
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Todo lo que necesitas para{" "}
            <span className="text-primary">ahorrar</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Herramientas simples pero poderosas para que tengas visibilidad
            total de tus gastos recurrentes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border bg-card/50 hover:bg-card hover:shadow-primary/5 hover:border-primary/20 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1.5 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="mb-10 text-center">
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Trusted by teams at
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50 grayscale">
          {["Google", "Meta", "Apple", "Amazon", "Microsoft"].map((company) => (
            <span
              key={company}
              className="text-muted-foreground text-xl font-semibold"
            >
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="from-primary/90 to-primary relative overflow-hidden rounded-3xl bg-linear-to-br p-8 text-center md:p-14">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-primary-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              ¿Listo para tomar el control?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Únete a miles de personas que ya están ahorrando dinero con
              Cusana. Comienza gratis hoy.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 text-base"
                render={<Link href="/register" />}
              >
                Comenzar gratis
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground px-8 text-base hover:bg-white/10"
              >
                Contactar ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <FlowerIcon className="size-8" />
            <span className="text-lg font-bold">Cusana</span>
          </div>

          <nav
            className="text-muted-foreground flex items-center gap-6 text-sm"
            aria-label="Legal"
          >
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
            <Link
              href="mailto:lolesuncrak@gmail.com"
              className="hover:text-foreground transition-colors"
              aria-hidden="true"
            >
              Contacto
            </Link>
          </nav>

          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Cusana. Todos los derechos
            reservados.
          </p>
        </div>
      </footer>

      {/* Custom styles for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </main>
  );
}
