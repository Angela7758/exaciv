import {describe,it,expect} from 'vitest';
import {latestCompleteExam} from '@/lib/exam-summary';
describe('Dernière simulation complète',()=>{
 it('ne présente pas un ancien test de 1 question comme examen complet',()=>{
  expect(latestCompleteExam([{kind:'exam',total:1,completed_at:'2026-10-25'}])).toBeUndefined();
 });
 it('ignore les sessions non terminées et garde la dernière simulation de 40 questions',()=>{
  const sessions=[{id:'older',kind:'exam',total:40,completed_at:'2026-10-23'},{id:'current',kind:'exam',total:40,completed_at:null},{id:'latest',kind:'exam',total:40,completed_at:'2026-10-24'}];
  expect(latestCompleteExam(sessions)?.id).toBe('latest');
  expect(sessions).toHaveLength(3);
 });
});