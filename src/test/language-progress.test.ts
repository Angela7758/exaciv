import {describe,it,expect} from 'vitest';
import {summarizeByLocale} from '@/lib/activity';
describe('progress by language',()=>{
  it('counts only real completions and finished sessions per language',()=>{
    const rows=summarizeByLocale(
      [{locale:'pt',kind:'lesson',ref:'vote'},{locale:'pt',kind:'lesson',ref:'devise'},{locale:'pt',kind:'video',ref:'vote'},{locale:'pt',kind:'session',ref:'s1'},{locale:'pt',kind:'session',ref:'s2'},{locale:'es',kind:'session',ref:'s3'}],
      ['vote'],
      [{id:'s1',correct:4,total:5,completed_at:'2026-10-23'},{id:'s2',correct:null,total:5,completed_at:null},{id:'s3',correct:1,total:2,completed_at:'2026-10-23'}]);
    expect(rows.map(r=>r.locale)).toEqual(['en','es','ar','ru','pt']);
    expect(rows.find(r=>r.locale==='pt')).toEqual({locale:'pt',lessons:1,videos:1,correct:4,total:5});
    expect(rows.find(r=>r.locale==='es')).toMatchObject({correct:1,total:2});
  });
});
