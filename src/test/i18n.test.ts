import {describe,it,expect} from 'vitest';
import {resolveUiMessage} from '@/lib/i18n/internal';
import internalMessages from '@/lib/i18n/internal-messages.json';
import {translate,LOCALE_IDS} from '@/lib/i18n';

describe('Interface locale rules',()=>{
  it('retains existing languages and adds Portuguese for the homepage',()=>{
    expect(LOCALE_IDS).toEqual(['fr','en','zh','ar','es','ru','pt']);
  });
  it('falls back to French when a translation is absent',()=>{
    expect(resolveUiMessage({},'zh','Reprendre la session')).toEqual({text:'Reprendre la session',fallback:true});
    expect(translate('fr','account.title')).toBe('Mon compte');
    expect(translate('pt','account.title')).toBe('A minha conta');
  });
  it('preserves actual session numbers when translating',()=>{
    expect(resolveUiMessage({en:{'Question {0} sur {1}':'Question {0} of {1}'}},'en','Question {0} sur {1}',[2,8])).toEqual({text:'Question 2 of 8',fallback:false});
  });
  it('includes every internal message in all five dictionaries with unchanged placeholders',()=>{
    const keys=Object.keys(internalMessages.en).sort();
    for(const locale of ['en','zh','ar','es','ru','pt'] as const){
      const dictionary=internalMessages[locale] as Record<string,string>;
      expect(Object.keys(dictionary).sort()).toEqual(keys);
      for(const key of keys){
        const translated=dictionary[key];
        expect(translated).toBeDefined();
        if(translated===undefined)throw new Error(`Missing translation: ${locale}`);
        expect(translated.trim().length).toBeGreaterThan(0);
        expect((translated.match(/\{\d+\}/g)??[]).sort()).toEqual((key.match(/\{\d+\}/g)??[]).sort());
      }
    }
  });
  it('does not translate arbitrary pedagogical content',()=>{
    expect(resolveUiMessage({en:{'Question suivante':'Next question'}},'en','Pour combien d’années le Président de la République est-il élu ?').text).toBe('Pour combien d’années le Président de la République est-il élu ?');
  });
});