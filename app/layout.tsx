import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { profile } from "@/content/profile";
import { es } from "@/i18n/translations/es";

// Grotesca geométrica para todo el texto. latin-ext cubre las diéresis y la eñe
// que necesitan las versiones en alemán y español.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${display.variable} ${mono.variable} min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* El diseño es oscuro por defecto: si el visitante no ha elegido, se
            queda en oscuro en vez de seguir al sistema. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
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
