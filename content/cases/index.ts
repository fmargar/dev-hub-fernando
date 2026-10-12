import type { CaseStudy, ContentLocale } from "../types";
import { uniformesBahiaEs } from "./uniformes-bahia.es";
import { uniformesBahiaEn } from "./uniformes-bahia.en";
import { vadosEs } from "./vados.es";
import { vadosEn } from "./vados.en";
import { marbellaFacilEs } from "./marbella-facil.es";
import { marbellaFacilEn } from "./marbella-facil.en";
import { adivinadleEs } from "./adivinadle.es";
import { adivinadleEn } from "./adivinadle.en";
import { agentesIaEs } from "./agentes-ia.es";
import { agentesIaEn } from "./agentes-ia.en";
import { visionLocalEs } from "./vision-local.es";
import { visionLocalEn } from "./vision-local.en";
import { homelabEs } from "./homelab.es";
import { homelabEn } from "./homelab.en";

const byLocale: Record<ContentLocale, CaseStudy[]> = {
  es: [uniformesBahiaEs, vadosEs, marbellaFacilEs, adivinadleEs, agentesIaEs, visionLocalEs, homelabEs],
  en: [uniformesBahiaEn, vadosEn, marbellaFacilEn, adivinadleEn, agentesIaEn, visionLocalEn, homelabEn],
};

const CONTENT_LOCALES: ContentLocale[] = ["es", "en"];

/** Los dos idiomas tienen contenido completo; cualquier otro cae al español. */
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

/**
 * Casos agrupados por tipo. El trabajo remunerado o académico va primero y los
 * proyectos propios después: mezclarlos resta credibilidad a los primeros.
 */
export function getCasesByTrack(locale: string): {
  professional: CaseStudy[];
  personal: CaseStudy[];
} {
  const all = getCases(locale);
  return {
    professional: all.filter((c) => c.track === "professional"),
    personal: all.filter((c) => c.track === "personal"),
  };
}

/** Índice global (1..n) por slug, para numerar igual en la home y en /work. */
export function getCaseNumbers(locale: string): Record<string, number> {
  const { professional, personal } = getCasesByTrack(locale);
  const ordered = [...professional, ...personal];
  return Object.fromEntries(ordered.map((c, i) => [c.slug, i + 1]));
}

/** Slugs para `generateStaticParams`; son iguales en todos los idiomas. */
export const caseSlugs = byLocale.es.map((c) => c.slug);
