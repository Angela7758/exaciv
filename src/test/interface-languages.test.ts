import {describe,it,expect} from 'vitest';
import {PUBLIC_LOCALES} from '@/config/interface-languages';
import {INTERFACE_LOCALES} from '@/config/learning';

describe('Public language choices',()=>{
  it('offers the six requested languages without Portuguese',()=>{
    expect(PUBLIC_LOCALES).toEqual(['fr','zh','en','ar','es','ru']);
    expect(INTERFACE_LOCALES.map(l=>l.id)).toEqual(['fr','zh','en','ar','es','ru']);
  });
});