import {
  defaultLocale,
  isLocale,
  languageStorageKey,
} from "@/lib/i18n/settings";
import { siteConfig, siteKeywords } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Providers from "./providers";

const geistMonoHeading = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const metadataBase = new URL(siteConfig.url);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteKeywords,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Cusana — Controla y optimiza tus suscripciones",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/twitter-image"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: ["/favicon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  themeColor: "#4F46E5",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const storedLang = cookieStore.get(languageStorageKey)?.value;
  const initialLanguage = isLocale(storedLang) ? storedLang : defaultLocale;

  return (
    <html
      lang={initialLanguage}
      className={cn(
        "overflow-x-hidden",
        "font-sans",
        geist.variable,
        geistMonoHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body
        className={`${geistMono.variable} ${geist.variable} overflow-x-hidden antialiased`}
      >
        <Providers initialLanguage={initialLanguage}>{children}</Providers>
      </body>
      <Analytics />
    </html>
  );
}
