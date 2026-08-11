import { I18nProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { SpaceFallback } from "@/components/space/SpaceFallback";

// El chrome que comparten los dos layouts raíz (app/(root) y app/[locale]),
// para que ninguno de los dos pueda divergir del otro por accidente.
//
// Sin ThemeProvider: el sitio es oscuro permanente (redisño espacial 2026),
// la clase .dark va fija en <html> desde los dos layouts raíz.
//
// SpaceFallback es el nivel 0 del sistema espacial: fondo fijo en CSS puro,
// sin JS. La fase 4 lo envuelve en SpaceStage y añade el canvas WebGL para
// niveles ≥1, pero el punto de montaje y el contrato visual quedan fijados
// aquí desde ya.
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <I18nProvider locale={locale}>
      <SpaceFallback />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer />
    </I18nProvider>
  );
}
