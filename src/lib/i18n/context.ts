import {createContext} from 'react';
import type {Locale} from './index';
import type {MessageKey} from './fr';

export type I18nValue = {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: MessageKey) => string;
  setLocale: (locale: Locale) => void;
};

// Keep the context identity independent of dictionary/provider hot updates.
export const I18nContext = createContext<I18nValue | null>(null);