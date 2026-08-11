"use client";

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { es, TranslationKeys } from './translations/es';
import { en } from './translations/en';
import { de } from './translations/de';

export type Locale = 'es' | 'en' | 'de';

const translations: Record<Locale, TranslationKeys> = {
  es,
  en,
  de,
};

interface I18nContextType {
  locale: Locale;
  t: TranslationKeys & { locale: Locale };
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/* ── Idioma elegido ───────────────────────────────────────────────────────────
   El idioma vive en la URL (/, /en, /de), no en localStorage: lo fija el
   layout raíz que corresponda — app/(root)/layout.tsx siempre pasa "es",
   app/[locale]/layout.tsx pasa el segmento de la ruta — y viaja aquí como
   prop, no como estado leído tras hidratar.

   Antes el idioma vivía en localStorage y el proveedor devolvía el valor por
   defecto hasta que un efecto lo corregía tras montar: el HTML del servidor
   nunca coincidía con la preferencia real del visitante, y cambiar de idioma
   era una escritura en el navegador, no una navegación — así que un enlace
   compartido siempre abría en español. Con el idioma en la URL, el HTML del
   servidor es siempre correcto y desaparece esa clase entera de bugs.
   ─────────────────────────────────────────────────────────────────────────── */

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<I18nContextType>(
    () => ({ locale, t: { ...translations[locale], locale } }),
    [locale],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
