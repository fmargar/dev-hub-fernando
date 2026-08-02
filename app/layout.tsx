import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { profile } from "@/content/profile";
import { es } from "@/i18n/translations/es";

// Geist es una geométrica de interfaz con una escala óptica muy limpia a
// tamaños pequeños, que es donde se juega la legibilidad de este sitio. La
// mono acompaña solo a los datos: referencias, rutas e identificadores.
// latin-ext cubre las diéresis y la eñe del alemán y el español.
const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: {
    default: es.metadata.title,
    template: `%s · ${es.metadata.siteName}`,
  },
  description: es.metadata.description,
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
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
    locale: "es_ES",
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

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.shortName,
  url: profile.site,
  email: `mailto:${profile.email}`,
  jobTitle: "Full stack developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marbella",
    addressCountry: "ES",
  },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ["Laravel", "React", "Next.js", "PostgreSQL", "Docker", "TypeScript"],
};

const directionContract = `<!--
  DIRECTION: standing exit taken by the user after four rejected worlds. The
  category convention is the commitment, not the fallback: a modern product
  site, played straight, at full craft fidelity, with no irony and no smuggled
  quirk. Roll key e95bc100 was overridden by the brief, which wins.
  BRAND COMMITMENT: light by default with a designed dark counterpart; warm
  neutral base; one accent (vermilion) spent only on primary action, focus and
  active state; Geist for interface, Geist Mono reserved for the record
  register — metadata labels, machine values, code — never for UI chrome.
  CRAFT BAR (set by the user): itshover, Linear, Stripe/Resend, studio
  portfolios. Their finish level is the floor, not their layouts.
  STORY: the visitor lands on the work itself — real screenshots of shipped
  software — and can walk into any case to find the problem, the decision and
  what was left unresolved.
  FIRST VIEWPORT: glass navbar, a headline at display scale over a faint
  two-focus accent field, two actions with animated icons, and a hairline row of
  facts. No metric strip, no eyebrow, no card grid.
  MOTION: itshover animated icons driven from their parent's hover, short
  reveals on scroll, 0.16-0.22s eases. Everything off under reduced motion.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and DESIGN.md
-->`;

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
        {/* Claro por defecto, y el sistema decide si ya tiene preferencia. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <ScrollProgress />
            <CommandPalette />
            <Navbar />
            <main id="content" className="flex-1">
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
