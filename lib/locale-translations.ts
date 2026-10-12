import { en } from "@/i18n/translations/en";
import type { TranslationKeys } from "@/i18n/translations/es";

/**
 * Solo los idiomas con prefijo de URL (/en, /de): el español vive en
 * app/(root) y usa i18n/translations/es directamente. Pensado para
 * generateMetadata en app/[locale]/**, donde el locale ya viene acotado a
 * "en" por dynamicParams=false del layout.
 */
export const PREFIXED_TRANSLATIONS: Record<"en", TranslationKeys> = { en };
