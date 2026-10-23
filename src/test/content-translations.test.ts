import {describe,it,expect} from 'vitest';
import {resolveContentMessage} from '@/lib/i18n/content';
import {localeSchema} from '@/lib/registration';
import {accountSettingsSchema} from '@/lib/account-settings';

describe('Content translation display rules',()=>{
  it('keeps French available and falls back when the source changes',()=>{
    const messages={en:{'Texte source':'Source text'}};
    expect(resolveContentMessage('en','Texte source',messages)).toEqual({text:'Source text',fallback:false});
    expect(resolveContentMessage('en','Nouveau texte',messages)).toEqual({text:'Nouveau texte',fallback:true});
    expect(resolveContentMessage('fr','Texte source',messages)).toEqual({text:'Texte source',fallback:false});
  });
  it('accepts the five requested languages for account and assistance preferences',()=>{
    for(const locale of ['en','es','ar','ru','pt']){
      expect(localeSchema.parse(locale)).toBe(locale);
      expect(accountSettingsSchema.shape.locale.parse(locale)).toBe(locale);
      expect(accountSettingsSchema.shape.help_locale.parse(locale)).toBe(locale);
    }
    expect(localeSchema.safeParse('invalid').success).toBe(false);
  });
  it('translates option display without altering answer indexes or originals',()=>{
    const options=['A','B','C','D'];const answer=1;
    const translated=options.map(source=>resolveContentMessage('pt',source,{pt:{A:'Um',B:'Dois',C:'Três',D:'Quatro'}}).text);
    expect(translated[answer]).toBe('Dois');
    expect(options).toEqual(['A','B','C','D']);
    expect(answer).toBe(1);
  });
});