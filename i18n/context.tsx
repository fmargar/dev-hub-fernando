"use client";

import React, { createContext, useContext, useEffect, useMemo, useSyncExternalStore, ReactNode } from 'react';
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
  setLocale: (locale: Locale) => void;
  t: TranslationKeys & { locale: Locale };
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'preferred-locale';
const LOCALE_EVENT = 'fmargar:locale';
const DEFAULT_LOCALE: Locale = 'es';

function isLocale(value: string | null): value is Locale {
  return value === 'es' || value === 'en' || value === 'de';
}

/* ── Idioma elegido ───────────────────────────────────────────────────────────
   Vive en localStorage, que el servidor no puede leer. Se expone con
   `useSyncExternalStore` en lugar de con un efecto de montaje: el servidor y la
   hidratación usan el idioma por defecto, y React cambia al guardado justo
   después, sin desajuste de hidratación.

   Antes el proveedor devolvía `null` hasta hidratar, así que el HTML del
   servidor salía **vacío**: ni navegación, ni casos, ni texto. Para un sitio
   cuyo objetivo es que lo lean buscadores y herramientas de reclutamiento, eso
   era tirar a la basura todo el contenido.
   ─────────────────────────────────────────────────────────────────────────── */

function subscribe(onChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(LOCALE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY) ?? DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function getServerSnapshot(): string {
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const locale: Locale = isLocale(stored) ? stored : DEFAULT_LOCALE;

  // El atributo lang del documento se sincroniza con el idioma activo; es una
  // escritura en el DOM, no un cambio de estado de React.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextType>(
    () => ({
      locale,
      setLocale: (newLocale: Locale) => {
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
        } catch {
          // Sin almacenamiento (modo privado), el cambio dura la sesión.
        }
        window.dispatchEvent(new Event(LOCALE_EVENT));
      },
      t: { ...translations[locale], locale },
    }),
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
