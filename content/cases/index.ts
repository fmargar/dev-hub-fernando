import type { CaseStudy, ContentLocale } from "../types";
import { vadosEs } from "./vados.es";
import { vadosEn } from "./vados.en";
import { vadosDe } from "./vados.de";
import { marbellaFacilEs } from "./marbella-facil.es";
import { marbellaFacilEn } from "./marbella-facil.en";
import { marbellaFacilDe } from "./marbella-facil.de";
import { homelabEs } from "./homelab.es";
import { homelabEn } from "./homelab.en";
import { homelabDe } from "./homelab.de";
import { galleryEs } from "./fmargar-gallery.es";
import { galleryEn } from "./fmargar-gallery.en";
import { galleryDe } from "./fmargar-gallery.de";

const byLocale: Record<ContentLocale, CaseStudy[]> = {
  es: [vadosEs, marbellaFacilEs, homelabEs, galleryEs],
  en: [vadosEn, marbellaFacilEn, homelabEn, galleryEn],
  de: [vadosDe, marbellaFacilDe, homelabDe, galleryDe],
};

const CONTENT_LOCALES: ContentLocale[] = ["es", "en", "de"];

/** Los tres idiomas tienen contenido completo; cualquier otro cae al español. */
export function resolveContentLocale(locale: string): ContentLocale {
  return CONTENT_LOCALES.includes(locale as ContentLocale) ? (locale as ContentLocale) : "es";
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
