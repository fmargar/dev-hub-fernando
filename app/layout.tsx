import type { Metadata } from "next";
import { Archivo_Narrow, Courier_Prime } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { profile } from "@/content/profile";
import { es } from "@/i18n/translations/es";

// Las dos letras del archivo: la condensada de las etiquetas de cajón y la
// mecanografiada de las fichas. latin-ext cubre las diéresis y la eñe que
// necesitan las versiones en alemán y español.
const cond = Archivo_Narrow({
  variable: "--font-cond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const typewriter = Courier_Prime({
  variable: "--font-type",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
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
  THESIS: este sitio es el archivo del que salen los expedientes; rechaza la
  parrilla de tarjetas iguales del portfolio de desarrollador.
  OWN-WORLD: chapa de archivador verde oliva y latón; la ficha color hueso es el
  único material claro. Pestañas de separador como navegación, placa de cajón,
  tampón de goma y la varilla que atraviesa la ficha. Archivo Narrow para
  etiquetas, Courier Prime para lo mecanografiado.
  STORY: el visitante abre un cajón, saca la ficha de un trabajo real y encuentra
  dentro la captura, la decisión y lo que quedó fuera.
  FIRST VIEWPORT: pestañas arriba, frente de cajón con tirador y placa, titular a
  gran tamaño y la ficha destacada con su captura.
  FORM: archivo de expedientes; candidato 7 de la lista ordenada por resonancia;
  seed 076aca04.
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
      <body
        className={`${cond.variable} ${typewriter.variable} min-h-screen flex flex-col`}
      >
        <div hidden dangerouslySetInnerHTML={{ __html: directionContract }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Cerrado es el cajón en la oficina; claro es la ficha sobre la mesa. */}
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
