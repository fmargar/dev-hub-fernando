import type { Locale } from "@/i18n";
import { LOCALES, localizePath } from "@/lib/locale-paths";

const OG_LOCALE: Record<Locale, string> = { es: "es_ES", en: "en_US", de: "de_DE" };

/**
 * hreflang para una ruta que vive en los tres idiomas (home, /work, un caso,
 * /experience, /stack, /contact). Las 33 herramientas no la usan: no tienen
 * variante /en ni /de, así que no declaran alternates de idioma.
 *
 * El canónico es autorreferente (la propia página, en su propio idioma): las
 * tres versiones tienen contenido distinto, no son la misma página
 * duplicada, así que no deben consolidarse en una sola canonical.
 */
export function alternatesFor(path: string, locale: Locale) {
  const languages: Record<string, string> = { "x-default": localizePath(path, "es") };
  for (const loc of LOCALES) {
    languages[loc] = localizePath(path, loc);
  }

  return {
    canonical: localizePath(path, locale),
    languages,
  };
}

export function ogLocaleFor(locale: Locale): string {
  return OG_LOCALE[locale];
}
