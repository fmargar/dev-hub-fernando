import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BB8Companion } from "@/components/ui/BB8Companion";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { IntroWrapper } from "@/components/layout/IntroWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fmargar.es"),
  title: "Fernando Máximo | Full Stack Developer",
  description: "Desarrollador Full Stack especializado en arquitecturas modernas, Cloud y soluciones empresariales de alto rendimiento.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dev Hub · Fernando",
  },
  openGraph: {
    title: "Fernando Máximo | Full Stack Developer",
    description: "Portafolio profesional de Fernando Máximo. Especialista en React, Next.js, Node.js y soluciones Cloud.",
    url: "https://fmargar.es",
    siteName: "Fernando Máximo Portfolio",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fernando Máximo | Full Stack Developer",
    description: "Desarrollador Full Stack especializado en arquitecturas modernas y Cloud.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function setVh() {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
              }
              setVh();
              let lastWidth = window.innerWidth;
              window.addEventListener('resize', () => {
                if (window.innerWidth !== lastWidth) {
                  setVh();
                  lastWidth = window.innerWidth;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <IntroWrapper>
              <CommandPalette />
              <BB8Companion />
              <ScrollProgress />
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </IntroWrapper>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
