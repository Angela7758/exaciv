import {describe,it,expect} from 'vitest';
import {latestCompleteExam} from '@/lib/exam-summary';
const recorded={questions:[{id:'q',theme:'Institutions',question:'q',options:['A','B'],answer:0,explanation:'',source:''}],answers:{'0':0}};
describe('Dernière simulation complète',()=>{
 it('ne présente pas un ancien test de 1 question comme examen complet',()=>{
   expect(latestCompleteExam([{...recorded,kind:'exam',total:1,completed_at:'2026-10-25'}])).toBeUndefined();
 });
 it('ignore les sessions non terminées et garde la dernière simulation de 40 questions',()=>{
   const sessions=[{...recorded,id:'older',kind:'exam',total:40,completed_at:'2026-10-23'},{...recorded,id:'current',kind:'exam',total:40,completed_at:null},{...recorded,id:'latest',kind:'exam',total:40,completed_at:'2026-10-24'}];
  expect(latestCompleteExam(sessions)?.id).toBe('latest');
  expect(sessions).toHaveLength(3);
 });
  it('ignores a completed empty-answers 0/40 exam',()=>expect(latestCompleteExam([{...recorded,answers:{},kind:'exam',total:40,completed_at:'2026-10-25'}])).toBeUndefined());
});