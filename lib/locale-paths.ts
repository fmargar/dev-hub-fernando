import { useI18n, type Locale } from "@/i18n";

export const LOCALES: Locale[] = ["es", "en", "de"];
const PREFIXED_LOCALES = ["en", "de"] as const;

/**
 * Rutas que deliberadamente no entran en el segmento de idioma (las 33
 * herramientas: 99 páginas estáticas con bundles pesados a cambio de nada).
 * `localizePath` las deja tal cual pase lo que pase, para que ningún enlace
 * generado apunte nunca a un /en/tools o /de/tools inexistente.
 */
const UNLOCALIZED_PREFIXES = ["/tools"];

function isUnlocalized(path: string): boolean {
  return UNLOCALIZED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** Español es el canónico sin prefijo: /work, no /es/work. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === "es" || isUnlocalized(path)) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Separa el prefijo de idioma de un pathname ya resuelto (p. ej. el de usePathname). */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const match = pathname.match(/^\/(en|de)(?=\/|$)/);
  if (match) {
    const locale = match[1] as Locale;
    const rest = pathname.slice(match[0].length);
    return { locale, path: rest === "" ? "/" : rest };
  }
  return { locale: "es", path: pathname };
}

/**
 * Ruta equivalente en otro idioma a partir del pathname actual. Se usa en el
 * selector de idioma: si la ruta actual es de las que no viven en el
 * segmento de idioma (las herramientas), cae a la home del idioma destino en
 * vez de construir un enlace roto.
 */
export function localizedPathFor(pathname: string, targetLocale: Locale): string {
  const { path } = stripLocale(pathname);
  if (isUnlocalized(path)) return localizePath("/", targetLocale);
  return localizePath(path, targetLocale);
}

/** Prefija un href interno (p. ej. "/work") con el idioma activo. */
export function useLocalizedHref() {
  const { locale } = useI18n();
  return (path: string) => localizePath(path, locale);
}

export { PREFIXED_LOCALES };
