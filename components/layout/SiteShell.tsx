import { I18nProvider, type Locale } from "@/i18n";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { SpaceStage } from "@/components/space/SpaceStage";
import { SpaceRouteSync } from "@/components/space/SpaceRouteSync";
import { WarpOverlay } from "@/components/space/WarpOverlay";

// El chrome que comparten los dos layouts raíz (app/(root) y app/[locale]),
// para que ninguno de los dos pueda divergir del otro por accidente.
//
// Sin ThemeProvider: el sitio es oscuro permanente (redisño espacial 2026),
// la clase .dark va fija en <html> desde los dos layouts raíz.
//
// SpaceStage decide nivel 0 (CSS puro) vs. canvas WebGL — SiteShell sigue
// siendo Server Component, SpaceStage es quien lleva el "use client" y hace
// el import dinámico de three.
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <I18nProvider locale={locale}>
      <SpaceStage />
      <SpaceRouteSync />
      <WarpOverlay />
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
