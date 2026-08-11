import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

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

// Anybody (OFL, google/fonts). Variable en anchura y peso, subseteada a mano
// a latin+latin-ext (65 KB woff2, sin fonttools disponible en el servidor
// para instanciar un único peso estático — sigue siendo un solo fichero
// autoalojado, cero peticiones externas en runtime). Solo alimenta
// .display-1/-2 en app/globals.css: el resto del sitio no la carga.
export const display = localFont({
  src: "../public/fonts/anybody-variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "600 800",
});
