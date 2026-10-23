import {useCallback} from 'react';
import {useI18n, type Locale} from './index';
import messages from './internal-messages.json';

export type UiTranslations = Partial<Record<Locale, Record<string, string>>>;

export function resolveUiMessage(dictionary: UiTranslations, locale: Locale, source: string, values: unknown[] = []) {
  const translated = locale === 'fr' ? source : dictionary[locale]?.[source];
  const text = translated || source;
  return {
    text: text.replace(/\{(\d+)\}/g, (match, index: string) => {
      const value = values[Number(index)];
      return value === undefined || value === null ? match : String(value);
    }),
    fallback: locale !== 'fr' && !translated,
  };
}

/** Only explicit interface messages enter this dictionary; Cloud content stays French. */
export function useUiT() {
  const {locale} = useI18n();
  return useCallback((source: string, ...values: unknown[]) => resolveUiMessage(messages, locale, source, values).text, [locale]);
}