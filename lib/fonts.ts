import { Geist, Geist_Mono } from "next/font/google";

// Compartidas entre app/(root)/layout.tsx y app/[locale]/layout.tsx: son dos
// layouts raíz distintos (patrón de múltiples layouts raíz), pero deben cargar
// la misma fuente una sola vez, no una instancia por grupo.
export const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
