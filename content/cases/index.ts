import type { CaseStudy, ContentLocale } from "../types";
import { vadosEs } from "./vados.es";
import { vadosEn } from "./vados.en";
import { marbellaFacilEs } from "./marbella-facil.es";
import { marbellaFacilEn } from "./marbella-facil.en";
import { homelabEs } from "./homelab.es";
import { homelabEn } from "./homelab.en";
import { galleryEs } from "./fmargar-gallery.es";
import { galleryEn } from "./fmargar-gallery.en";

const byLocale: Record<ContentLocale, CaseStudy[]> = {
  es: [vadosEs, marbellaFacilEs, homelabEs, galleryEs],
  en: [vadosEn, marbellaFacilEn, homelabEn, galleryEn],
};

/**
 * El alemán reutiliza el inglés para los cuerpos largos de los casos: la
 * interfaz sí está traducida a DE, pero mantener tres versiones de varios miles
 * de palabras sincronizadas no compensa hoy. `resolveContentLocale` es el único
 * punto donde vive esa decisión.
 */
export function resolveContentLocale(locale: string): ContentLocale {
  return locale === "es" ? "es" : "en";
}

export function getCases(locale: string): CaseStudy[] {
  return [...byLocale[resolveContentLocale(locale)]].sort((a, b) => a.order - b.order);
}

export function getCase(locale: string, slug: string): CaseStudy | undefined {
  return byLocale[resolveContentLocale(locale)].find((c) => c.slug === slug);
}

export function getFeaturedCases(locale: string): CaseStudy[] {
  return getCases(locale).filter((c) => c.featured);
}

/** Slugs para `generateStaticParams`; son iguales en todos los idiomas. */
export const caseSlugs = byLocale.es.map((c) => c.slug);
