import {resolveContentMessage} from '@/lib/i18n/content';

export const QUESTION_HELP_LOCALES = [
  {id:'fr',label:'Français',speech:'fr-FR'},
  {id:'zh',label:'中文',speech:'zh-CN'},
  {id:'en',label:'English',speech:'en-GB'},
  {id:'ar',label:'العربية',speech:'ar-SA'},
  {id:'es',label:'Español',speech:'es-ES'},
  {id:'ru',label:'Русский',speech:'ru-RU'},
] as const;
export type QuestionHelpLocale = typeof QUESTION_HELP_LOCALES[number]['id'];
export function questionHelpLocale(value:string):QuestionHelpLocale {
  return QUESTION_HELP_LOCALES.find(l=>l.id===value)?.id??'fr';
}
export function visibleQuestionTexts(question:string,options:string[],explanation?:string) {
  return [question,...options,...(explanation?[explanation]:[])];
}
export function localQuestionTranslation(target:QuestionHelpLocale,texts:string[]) {
  if(target==='fr')return texts;
  const translated=texts.map(text=>resolveContentMessage(target,text));
  return translated.every(t=>!t.fallback)?translated.map(t=>t.text):null;
}