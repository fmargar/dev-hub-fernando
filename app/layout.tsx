import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingSocialDock } from "@/components/ui/FloatingSocialDock";

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
  title: "Fernando Martínez | Full Stack Developer",
  description: "Desarrollador Full Stack especializado en arquitecturas modernas, Cloud y soluciones empresariales de alto rendimiento.",
  openGraph: {
    title: "Fernando Martínez | Full Stack Developer",
    description: "Portafolio profesional de Fernando Martínez. Especialista en React, Next.js, Node.js y soluciones Cloud.",
    url: "https://fmargar.es",
    siteName: "Fernando Martínez Portfolio",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Fernando Martínez | Full Stack Developer",
    description: "Desarrollador Full Stack especializado en arquitecturas modernas y Cloud.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/bb8.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingSocialDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
