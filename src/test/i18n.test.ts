import {describe,it,expect} from 'vitest';
import {resolveUiMessage} from '@/lib/i18n/internal';
import {translate,LOCALE_IDS} from '@/lib/i18n';

describe('Interface locale rules',()=>{
  it('offers French plus the five requested interface languages',()=>{
    expect(LOCALE_IDS).toEqual(['fr','en','zh','ar','es','ru']);
  });
  it('falls back to French when a translation is absent',()=>{
    expect(resolveUiMessage({},'zh','Reprendre la session')).toEqual({text:'Reprendre la session',fallback:true});
    expect(translate('fr','account.title')).toBe('Mon compte');
  });
  it('preserves actual session numbers when translating',()=>{
    expect(resolveUiMessage({en:{'Question {0} sur {1}':'Question {0} of {1}'}},'en','Question {0} sur {1}',[2,8])).toEqual({text:'Question 2 of 8',fallback:false});
  });
  it('does not translate arbitrary pedagogical content',()=>{
    expect(resolveUiMessage({en:{'Question suivante':'Next question'}},'en','Pour combien d’années le Président de la République est-il élu ?').text).toBe('Pour combien d’années le Président de la République est-il élu ?');
  });
});