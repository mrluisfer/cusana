"use client";
import { FlowerIcon, Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Bell,
  CreditCard,
  PieChart,
  Plus,
  Sparkles,
  Check,
} from "lucide-react";
import Link from "next/link";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import PhoneMockup from "@/components/landing/phone-mockup";

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
    <main className="min-h-screen bg-linear-to-b from-background to-muted/30 container max-w-6xl mx-auto px-4">
      {/* Header */}
      <header className="pt-4 flex items-center justify-between">
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Copy */}
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-sm font-medium gap-1.5"
            >
              <Sparkles className="size-3.5" />
              Nuevo: Insights con IA
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Tus suscripciones,
              <span className="text-primary"> bajo control.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Deja de perder dinero en servicios que olvidas. TrackO te ayuda a
              visualizar, organizar y optimizar todos tus pagos recurrentes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                className="text-base px-6"
                render={<Link href="/register" />}
              >
                Comenzar gratis
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-6">
                Ver demo
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <Check className="size-4 text-primary" />
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
              className="absolute -left-4 top-8 animate-float"
            />
            <ServiceIcon
              service="spotify"
              className="absolute -right-24 top-20 animate-float-delayed"
            />
            <ServiceIcon
              service="disney"
              className="absolute left-8 bottom-12 animate-float"
            />

            {/* Phone mockup */}
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${
                  index < stats.length - 1 ? "md:border-r md:border-border" : ""
                }`}
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4">
            Características
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitas para{" "}
            <span className="text-primary">ahorrar</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Herramientas simples pero poderosas para que tengas visibilidad
            total de tus gastos recurrentes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group p-6 border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1.5">
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
        <div className="text-center mb-10">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Trusted by teams at
          </p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50 grayscale">
          {["Google", "Meta", "Apple", "Amazon", "Microsoft"].map((company) => (
            <span
              key={company}
              className="text-xl font-semibold text-muted-foreground"
            >
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="relative rounded-3xl p-8 md:p-14 text-center overflow-hidden bg-linear-to-br from-primary/90 to-primary">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              ¿Listo para tomar el control?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Únete a miles de personas que ya están ahorrando dinero con
              TrackO. Comienza gratis hoy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8"
                render={<Link href="/register" />}
              >
                Comenzar gratis
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 text-base px-8"
              >
                Contactar ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <FlowerIcon className="size-8" />
            <span className="font-bold text-lg">TrackO.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Contacto
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 TrackO. Todos los derechos reservados.
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
