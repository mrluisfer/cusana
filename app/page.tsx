"use client";
import { ServiceIcon } from "@/components/dashboard/service-icon";
import PhoneMockup from "@/components/landing/phone-mockup";
import { FlowerIcon, Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { realServiceKeys } from "@/constants/icons";
import {
  ArrowRight,
  Bell,
  Check,
  CircleDashed,
  CircleDot,
  CreditCard,
  Eye,
  Lock,
  PieChart,
  Plus,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const features = [
  {
    icon: Plus,
    title: "Agrega en segundos",
    description:
      "Registra tus suscripciones con servicios reconocidos como Netflix, Spotify o Disney+ —sin escribir nada extra.",
    span: "md:col-span-2",
    accent: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  },
  {
    icon: Bell,
    title: "Recordatorios",
    description: "Sabe cuándo se renueva cada servicio antes del cargo.",
    span: "md:col-span-1",
    accent: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    icon: PieChart,
    title: "Resumen claro",
    description:
      "Visualiza el gasto total mensual y qué porcentaje aporta cada suscripción.",
    span: "md:col-span-1",
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    icon: CreditCard,
    title: "Múltiples tarjetas",
    description:
      "Asigna un método de pago a cada servicio para saber qué tarjeta se cobra cada mes.",
    span: "md:col-span-2",
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
];

// Hechos verificables sobre el producto — no métricas inventadas.
const principles = [
  {
    icon: Lock,
    value: "Sin banco",
    label: "Nunca pedimos credenciales bancarias",
  },
  {
    icon: Eye,
    value: "Privado",
    label: "Tus datos no se venden ni comparten",
  },
  {
    icon: Sparkles,
    value: "Gratis",
    label: "Acceso anticipado mientras estamos en beta",
  },
  {
    icon: Zap,
    value: "Open beta",
    label: "Construyéndose en público, semana a semana",
  },
];

const benefits = [
  "Sin tarjeta de crédito",
  "Sin conexión bancaria",
  "Cancela cuando quieras",
];

type RoadmapStatus = "available" | "soon" | "planned";
const roadmap: Record<
  RoadmapStatus,
  { title: string; items: { title: string; description: string }[] }
> = {
  available: {
    title: "Disponible hoy",
    items: [
      {
        title: "Registro manual de suscripciones",
        description:
          "Agrega cualquier servicio recurrente con precio, moneda y fecha de cobro.",
      },
      {
        title: "Catálogo de servicios",
        description:
          "Reconocimiento visual para los servicios más comunes en streaming, música y software.",
      },
      {
        title: "Resumen mensual",
        description:
          "Total mensual consolidado y desglose por servicio para tomar decisiones.",
      },
      {
        title: "Modo claro y oscuro",
        description: "Interfaz responsive con tema sincronizado al sistema.",
      },
    ],
  },
  soon: {
    title: "En camino",
    items: [
      {
        title: "Exportar a Excel",
        description:
          "Descarga el historial completo en .xlsx para tu contabilidad personal.",
      },
      {
        title: "Categorías personalizadas",
        description:
          "Agrupa servicios por categoría (entretenimiento, productividad, hogar…).",
      },
      {
        title: "Alertas previas al cobro",
        description: "Recordatorios configurables antes de cada renovación.",
      },
      {
        title: "Asistente con IA",
        description:
          "Conversa con tus datos: '¿qué suscripciones puedo cancelar?'",
      },
    ],
  },
  planned: {
    title: "En el horizonte",
    items: [
      {
        title: "Modo familiar / compartido",
        description:
          "Comparte suscripciones con tu pareja o familia y divide gastos.",
      },
      {
        title: "Detección desde el correo",
        description:
          "Importa recibos opcionalmente desde Gmail o Outlook con tu permiso.",
      },
      {
        title: "App móvil nativa",
        description:
          "Versión instalable con notificaciones push y widget de gasto.",
      },
      {
        title: "Multi-moneda y conversión",
        description:
          "Para quienes pagan servicios en USD pero viven con otra moneda.",
      },
    ],
  },
};

const faqs = [
  {
    q: "¿Cusana se conecta con mi banco?",
    a: "No. Cusana funciona con registro manual: tú decides qué suscripciones agregar. Nunca pedimos credenciales bancarias ni tokens de tu banco.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Mientras estamos en beta abierta, el acceso es gratuito. Cuando salgamos de beta tendremos un plan gratuito y uno de pago con funciones avanzadas.",
  },
  {
    q: "¿Qué tan estable es?",
    a: "Cusana es un proyecto activo en desarrollo. Las funciones publicadas en el roadmap como 'Disponible hoy' están operativas; el resto aún no.",
  },
  {
    q: "¿En qué dispositivos funciona?",
    a: "En cualquier navegador moderno —desktop, tablet o móvil— con una experiencia totalmente responsive y modo oscuro.",
  },
];

const statusMeta: Record<
  RoadmapStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  available: {
    label: "Disponible",
    icon: Check,
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  soon: {
    label: "Próximamente",
    icon: CircleDot,
    className: "bg-primary/15 text-primary",
  },
  planned: {
    label: "Planeado",
    icon: CircleDashed,
    className: "bg-muted text-muted-foreground",
  },
};

export default function LandingPage() {
  const [activeRoadmap, setActiveRoadmap] =
    useState<RoadmapStatus>("available");

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* Decorative background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="bg-primary/30 absolute top-[-10%] left-[10%] h-[40rem] w-[40rem] rounded-full blur-[120px] motion-safe:animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] h-[35rem] w-[35rem] rounded-full bg-fuchsia-500/20 blur-[120px] [animation-delay:1.5s] motion-safe:animate-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] h-[30rem] w-[30rem] rounded-full bg-sky-500/20 blur-[120px] [animation-delay:3s] motion-safe:animate-pulse" />

        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%)",
          }}
        />

        <div className="[background-image:url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] absolute inset-0 opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <header
          className="border-border/60 bg-background/60 supports-[backdrop-filter]:bg-background/40 sticky top-4 z-40 mt-4 flex items-center justify-between rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur-xl"
          role="banner"
        >
          <Logo />

          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="hidden sm:inline-flex"
              render={<Link href="/login" />}
            >
              Iniciar sesión
            </Button>
            <Button render={<Link href="/register" />}>
              Crear cuenta
              <ArrowRight className="ml-1 size-4" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="pt-20 pb-16 md:pt-28 md:pb-24"
          aria-labelledby="hero-heading"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7">
              <Link
                href="#roadmap"
                className="group border-border/70 bg-card/50 hover:bg-card focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 text-sm shadow-sm backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Beta abierta
                </span>
                <span className="text-muted-foreground">
                  Mira lo que estamos construyendo
                </span>
                <ArrowRight
                  className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <h1
                id="hero-heading"
                className="text-foreground text-5xl leading-[1.05] font-bold tracking-tight text-balance md:text-6xl lg:text-7xl"
              >
                Tus suscripciones,{" "}
                <span className="from-primary relative inline-block bg-linear-to-br via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
                  bajo control
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 12"
                    preserveAspectRatio="none"
                    className="text-primary/60 absolute -bottom-1 left-0 h-2 w-full"
                  >
                    <path
                      d="M2 8 Q 50 2, 100 6 T 198 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h1>

              <p className="text-muted-foreground max-w-lg text-lg leading-relaxed text-pretty">
                Un rastreador simple para saber qué pagas cada mes, cuándo se
                renueva y con qué tarjeta. Sin conectar tu banco, sin
                complicaciones.
              </p>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button
                  size="lg"
                  className="group shadow-primary/25 relative px-6 text-base shadow-lg"
                  render={<Link href="/register" />}
                >
                  Probar gratis
                  <ArrowRight
                    className="ml-2 size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 text-base backdrop-blur"
                  render={<Link href="#roadmap" />}
                >
                  Ver roadmap
                </Button>
              </div>

              <ul
                className="flex flex-wrap gap-x-5 gap-y-2 pt-1"
                aria-label="Beneficios principales"
              >
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="text-muted-foreground flex items-center gap-1.5 text-sm"
                  >
                    <span className="bg-primary/15 text-primary inline-flex size-4 items-center justify-center rounded-full">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center overflow-hidden lg:justify-end lg:overflow-visible">
              <ServiceIcon
                service="netflix"
                className="motion-safe:animate-float ring-border/50 absolute top-8 -left-4 z-10 hidden shadow-xl ring-1 sm:flex"
              />
              <ServiceIcon
                service="spotify"
                className="motion-safe:animate-float-delayed ring-border/50 absolute top-20 right-0 z-10 hidden shadow-xl ring-1 sm:flex lg:-right-24"
              />
              <ServiceIcon
                service="disney"
                className="motion-safe:animate-float ring-border/50 absolute bottom-12 left-8 z-10 hidden shadow-xl ring-1 sm:flex"
              />
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* Principles — verifiable product facts (replaces fake stats) */}
        <section className="py-12" aria-label="Principios del producto">
          <div className="border-border/60 bg-card/40 relative overflow-hidden rounded-3xl border p-8 backdrop-blur-xl md:p-10">
            <div className="from-primary/5 absolute inset-0 bg-linear-to-br via-transparent to-fuchsia-500/5" />
            <dl className="relative grid grid-cols-2 gap-y-8 md:grid-cols-4">
              {principles.map((item, index) => (
                <div
                  key={item.value}
                  className={`px-4 text-center ${
                    index < principles.length - 1
                      ? "md:border-border/60 md:border-r"
                      : ""
                  }`}
                >
                  <div className="bg-primary/10 text-primary ring-primary/20 mx-auto mb-3 flex size-10 items-center justify-center rounded-xl ring-1">
                    <item.icon className="size-4" aria-hidden="true" />
                  </div>
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="from-foreground to-foreground/60 bg-linear-to-br bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                    {item.value}
                  </dd>
                  <p className="text-muted-foreground mt-1 text-sm text-balance">
                    {item.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Features - Bento grid */}
        <section
          id="features"
          className="scroll-mt-24 py-20"
          aria-labelledby="features-heading"
        >
          <div className="mb-14 text-center">
            <Badge variant="default" className="mb-4 backdrop-blur">
              <Zap className="mr-1 size-3" aria-hidden="true" />
              Lo esencial
            </Badge>
            <h2
              id="features-heading"
              className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
            >
              Hecho para que dejes de{" "}
              <span className="from-primary bg-linear-to-r to-fuchsia-500 bg-clip-text text-transparent">
                olvidar
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-pretty">
              Sin dashboards inflados ni gráficas que no usas. Solo lo que de
              verdad necesitas para saber qué pagas cada mes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className={`group hover:border-primary/30 hover:shadow-primary/10 border-border/60 bg-card/40 relative overflow-hidden p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.span}`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <div className="relative flex items-start gap-4">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground ring-primary/20 flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-foreground mb-1.5 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-pretty">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Supported Services — replaces fake "trusted by" */}
        <section className="py-16" aria-labelledby="services-heading">
          <div className="mb-8 text-center">
            <Badge variant="default" className="mb-4 backdrop-blur">
              Servicios reconocidos
            </Badge>
            <h2
              id="services-heading"
              className="text-foreground text-2xl font-bold text-balance md:text-3xl"
            >
              Identificamos automáticamente los servicios que ya conoces
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Y si falta alguno, lo agregas manualmente en segundos.
            </p>
          </div>
          <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <ul className="motion-safe:animate-marquee mt-2 flex w-max items-center gap-4 motion-safe:group-hover:[animation-play-state:paused]">
              {[...realServiceKeys, ...realServiceKeys].map((service, i) => (
                <li
                  key={`${service}-${i}`}
                  aria-hidden={i >= realServiceKeys.length ? "true" : undefined}
                >
                  <ServiceIcon
                    service={service}
                    className="ring-border/50 shadow-sm ring-1 transition-transform hover:-translate-y-0.5 hover:scale-110"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Roadmap — interactive tabs */}
        <section
          id="roadmap"
          className="scroll-mt-24 py-20"
          aria-labelledby="roadmap-heading"
        >
          <div className="mb-12 text-center">
            <Badge variant="default" className="mb-4 backdrop-blur">
              Roadmap público
            </Badge>
            <h2
              id="roadmap-heading"
              className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl"
            >
              Construyéndose{" "}
              <span className="from-primary bg-linear-to-r to-fuchsia-500 bg-clip-text text-transparent">
                en público
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-pretty">
              Esto es lo que hay hoy, lo que viene y a dónde queremos llegar.
              Sin promesas vacías —solo lo que estamos construyendo.
            </p>
          </div>

          <Tabs
            value={activeRoadmap}
            onValueChange={(v) => setActiveRoadmap(v as RoadmapStatus)}
            className="space-y-8"
          >
            <TabsList className="bg-card/40 border-border/60 mx-auto w-fit border backdrop-blur-xl">
              {(Object.keys(roadmap) as RoadmapStatus[]).map((status) => {
                const meta = statusMeta[status];
                return (
                  <TabsTrigger key={status} value={status} className="gap-2">
                    <meta.icon className="size-3.5" aria-hidden="true" />
                    {meta.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {(Object.keys(roadmap) as RoadmapStatus[]).map((status) => {
              const meta = statusMeta[status];
              return (
                <TabsContent key={status} value={status}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {roadmap[status].items.map((item) => (
                      <Card
                        key={item.title}
                        className="group border-border/60 bg-card/40 hover:border-primary/30 relative overflow-hidden p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${meta.className}`}
                            aria-hidden="true"
                          >
                            <meta.icon className="size-4" />
                          </span>
                          <div>
                            <h3 className="text-foreground font-semibold">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground mt-1 text-sm leading-relaxed text-pretty">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </section>

        {/* FAQ */}
        <section className="py-20" aria-labelledby="faq-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge variant="default" className="mb-4 backdrop-blur">
                FAQ
              </Badge>
              <h2
                id="faq-heading"
                className="text-foreground text-3xl font-bold text-balance md:text-4xl"
              >
                Preguntas frecuentes
              </h2>
              <p className="text-muted-foreground mt-4 text-pretty">
                ¿No encuentras lo que buscas?{" "}
                <Link
                  href="mailto:lolesuncrak@gmail.com"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Escríbenos
                </Link>
                .
              </p>
            </div>
            <Accordion className="border-border/60 divide-border/60 bg-card/40 rounded-2xl border px-2 backdrop-blur-xl">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.q}
                  value={faq.q}
                  className="border-border/60 px-3"
                >
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-pretty">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" aria-labelledby="cta-heading">
          <div className="from-primary via-primary/95 to-primary/80 shadow-primary/20 relative overflow-hidden rounded-3xl bg-linear-to-br p-8 text-center shadow-2xl md:p-14">
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl motion-safe:animate-pulse"
            />
            <div
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-fuchsia-400/30 blur-3xl [animation-delay:1.5s] motion-safe:animate-pulse"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px] opacity-[0.15]"
            />

            <div className="relative z-10 mx-auto max-w-2xl">
              <h2
                id="cta-heading"
                className="text-primary-foreground mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl"
              >
                Empieza a ver tus suscripciones de una vez.
              </h2>
              <p className="text-primary-foreground/85 mb-8 text-lg text-pretty">
                Crear cuenta toma menos de un minuto. No necesitas tarjeta ni
                conectar tu banco.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  render={<Link href="/register" />}
                >
                  Crear cuenta gratis
                  <ArrowRight
                    className="ml-2 size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  render={<Link href="#roadmap" />}
                >
                  Ver qué viene
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-border/60 border-t py-10">
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
                className="hover:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Términos
              </Link>
              <Link
                href="mailto:lolesuncrak@gmail.com"
                className="hover:text-foreground focus-visible:ring-ring rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                Contacto
              </Link>
            </nav>

            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Cusana
            </p>
          </div>
        </footer>
      </div>

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
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-marquee {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}
