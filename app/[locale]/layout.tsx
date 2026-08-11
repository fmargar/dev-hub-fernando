import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { sans, mono } from "@/lib/fonts";
import { personJsonLd, directionContract } from "@/lib/site-jsonld";
import { SiteShell } from "@/components/layout/SiteShell";
import { profile } from "@/content/profile";
import { es } from "@/i18n/translations/es";
import { en } from "@/i18n/translations/en";
import { de } from "@/i18n/translations/de";
import { alternatesFor, ogLocaleFor } from "@/lib/alternates";
import { localizePath, PREFIXED_LOCALES } from "@/lib/locale-paths";
import type { Locale } from "@/i18n";

const METADATA_BY_LOCALE = { es, en, de };

// Solo en/de generan páginas estáticas aquí: el español vive en
// app/(root), no bajo /es. dynamicParams=false hace que un /fr caiga al
// not-found en vez de renderizar algo a medias.
export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}
export const dynamicParams = false;

function isPrefixedLocale(value: string): value is "en" | "de" {
  return (PREFIXED_LOCALES as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) return {};

  const m = METADATA_BY_LOCALE[locale].metadata;

  return {
    metadataBase: new URL(profile.site),
    title: {
      default: m.title,
      template: `%s · ${m.siteName}`,
    },
    description: m.description,
    manifest: "/manifest.json",
    alternates: alternatesFor("/", locale),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: m.siteName,
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${profile.site}${localizePath("/", locale)}`,
      siteName: m.siteName,
      locale: ogLocaleFor(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
    },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
  };
}

// Gemelo de app/(root)/layout.tsx para /en y /de (patrón de múltiples
// layouts raíz). SiteShell fija el idioma del provider por el segmento de la
// URL, no por localStorage: el HTML del servidor siempre es correcto.
export default async function LocaleRootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isPrefixedLocale(locale)) notFound();

  const activeLocale: Locale = locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <div hidden dangerouslySetInnerHTML={{ __html: directionContract }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteShell locale={activeLocale}>{children}</SiteShell>
      </body>
    </html>
  );
}
