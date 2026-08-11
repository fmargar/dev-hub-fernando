import type { Metadata } from "next";
import "../globals.css";
import { sans, mono } from "@/lib/fonts";
import { personJsonLd, directionContract } from "@/lib/site-jsonld";
import { SiteShell } from "@/components/layout/SiteShell";
import { profile } from "@/content/profile";
import { es } from "@/i18n/translations/es";
import { alternatesFor, ogLocaleFor } from "@/lib/alternates";

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: es.metadata.title,
    template: `%s · ${es.metadata.siteName}`,
  },
  description: es.metadata.description,
  manifest: "/manifest.json",
  alternates: alternatesFor("/", "es"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: es.metadata.siteName,
  },
  openGraph: {
    title: es.metadata.ogTitle,
    description: es.metadata.ogDescription,
    url: profile.site,
    siteName: es.metadata.siteName,
    locale: ogLocaleFor("es"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: es.metadata.ogTitle,
    description: es.metadata.ogDescription,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
};

// Layout raíz español: es el canónico, sin prefijo de idioma en la URL. Su
// gemelo es app/[locale]/layout.tsx (en/de) — patrón de múltiples layouts
// raíz, cada uno con su propio <html>/<body>. components/layout/SiteShell.tsx
// es el chrome que comparten para que no puedan divergir.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <div hidden dangerouslySetInnerHTML={{ __html: directionContract }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteShell locale="es">{children}</SiteShell>
      </body>
    </html>
  );
}
