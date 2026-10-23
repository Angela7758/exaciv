import {describe,it,expect} from 'vitest';
import {PUBLIC_LOCALES} from '@/config/interface-languages';

describe('Public language choices',()=>{
  it('offers the six requested languages without Portuguese',()=>{
    expect(PUBLIC_LOCALES).toEqual(['fr','zh','en','ar','es','ru']);
  });
});