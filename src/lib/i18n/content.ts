import {useCallback} from 'react';
import {useI18n, type Locale} from './index';
import dictionary from './content-messages.json';

type ContentDictionary = Partial<Record<Locale, Record<string,string>>>;
export function resolveContentMessage(locale: Locale, source: string, messages: ContentDictionary = dictionary) {
  const text = locale === 'fr' ? source : messages[locale]?.[source];
  return {text: text || source, fallback: locale !== 'fr' && !text};
}
/** Display-only translation: never change stored French snapshots or answer indexes. */
export function useContentT() {
  const {locale} = useI18n();
  return useCallback((source: string) => resolveContentMessage(locale, source).text,[locale]);
}