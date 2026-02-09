const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
  "http://localhost:3000";
const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl.slice(0, -1) : rawSiteUrl;

export const siteConfig = {
  name: "Cusana",
  title: "Cusana | Controla y optimiza tus suscripciones",
  description:
    "Cusana te ayuda a controlar y optimizar tus suscripciones: centraliza pagos, recibe alertas antes de cada cobro y descubre gastos innecesarios con insights claros.",
  url: siteUrl,
  locale: "es_ES",
  category: "Personal Finance",
};

export const siteKeywords = [
  "suscripciones",
  "control de suscripciones",
  "gastos recurrentes",
  "gastos mensuales",
  "finanzas personales",
  "ahorro",
  "recordatorios de cobro",
  "alertas de pago",
  "gestión de pagos",
  "tracking de suscripciones",
  "presupuesto",
  "optimización de gastos",
];
