import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fr, type MessageKey } from './fr';
export type { MessageKey } from './fr';
import { en } from './en';
import { zh } from './zh';
import { ar } from './ar';
import { es } from './es';
import { ru } from './ru';
import { pt } from './pt';

export type Locale = 'fr' | 'en' | 'zh' | 'ar' | 'es' | 'ru' | 'pt';
export const LOCALE_IDS: readonly Locale[] = ['fr', 'en', 'zh', 'ar', 'es', 'ru', 'pt'];
export const LOCALE_LABELS: Record<Locale, string> = { fr: 'Français', en: 'English', zh: '中文', ar: 'العربية', es: 'Español', ru: 'Русский', pt: 'Português' };

const dictionaries: Record<Locale, Partial<Record<MessageKey, string>>> = { fr, en, zh, ar, es, ru, pt };
const STORAGE_KEY = 'exaciv-locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALE_IDS as readonly string[]).includes(value);
}

export function translate(locale: Locale, key: MessageKey): string {
  return dictionaries[locale][key] ?? fr[key];
}

type I18nValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: MessageKey) => string;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored) && stored !== 'fr') setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo<I18nValue>(() => ({
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    t: (key) => translate(locale, key),
    setLocale: (next) => {
      setLocaleState(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage unavailable */ }
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}

export function useT(): (key: MessageKey) => string {
  return useI18n().t;
}
