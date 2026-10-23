import {useCallback} from 'react';
import {useI18n, type Locale} from './index';
import dictionary from './content-messages.json';

type ContentDictionary = Partial<Record<Locale, Record<string,string>>>;
export function resolveContentMessage(locale: Locale, source: string | undefined, messages: ContentDictionary = dictionary) {
  const original = source ?? '';
  const text = locale === 'fr' ? original : messages[locale]?.[original];
  return {text: text || original, fallback: locale !== 'fr' && !text};
}
/** Display-only translation: never change stored French snapshots or answer indexes. */
export function useContentT() {
  const {locale} = useI18n();
  return useCallback((source: string | undefined) => resolveContentMessage(locale, source).text,[locale]);
}