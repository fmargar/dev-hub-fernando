"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (savedLocale && (savedLocale === 'es' || savedLocale === 'en' || savedLocale === 'de')) {
      setLocaleState(savedLocale);
    }
    setIsHydrated(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: { ...translations[locale], locale },
  };

  // Avoid hydration mismatch by showing nothing until hydrated
  if (!isHydrated) {
    return null;
  }

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
