import {describe,it,expect} from 'vitest';
import {demoDiagnostic,diagnosticScore,recordedProgress,objectiveSchema,setRegistrationDraft,getRegistrationDraft,clearRegistrationDraft} from '@/lib/registration';
describe('four reference states',()=>{
 it('diagnostic 7/10 is 70 percent with coherent separate themes',()=>expect(diagnosticScore(demoDiagnostic.questions,demoDiagnostic.answers)).toEqual({correct:7,total:10,percent:70,themes:{'Institutions françaises':{correct:4,total:4},'Valeurs de la République':{correct:2,total:3},'Droits et devoirs':{correct:1,total:3}}}));
 it('scores actual answers instead of forcing the demo score',()=>expect(diagnosticScore(demoDiagnostic.questions,Array(10).fill(0)).correct).toBe(10));
 it('practice four recorded answers means 40 percent, not 50',()=>expect(recordedProgress({'0':1,'1':0,'2':2,'3':1},10)).toEqual({answered:4,unanswered:6,percent:40}));
 it('exam skips 17 and 40 and derives 38 recorded, two unanswered, 95 percent',()=>{const answers=Object.fromEntries(Array.from({length:40},(_,i)=>i).filter(i=>i!==16&&i!==39).map(i=>[String(i),1]));expect(recordedProgress(answers,40)).toEqual({answered:38,unanswered:2,percent:95});expect(answers['16']).toBeUndefined();expect(answers['39']).toBeUndefined();});
 it('a tentative choice does not count as a recorded answer',()=>{const answers={'0':1};const selected=2;expect(recordedProgress(answers,40).answered).toBe(1);expect(recordedProgress({...answers,'1':selected},40).answered).toBe(2);});
 it('keeps three separate valid pathways and rejects others',()=>{for(const parcours of ['naturalisation','resident','sejour'])expect(objectiveSchema.parse({parcours,locale:'fr',goal_date:'2026-11-01'}).parcours).toBe(parcours);expect(objectiveSchema.safeParse({parcours:'other',locale:'fr',goal_date:null}).success).toBe(false);});
 it('retains step-one fields in memory on return and clears them after signup',()=>{setRegistrationDraft({name:'Essai',email:'essai@example.test',password:'test-only'});expect(getRegistrationDraft()?.name).toBe('Essai');expect(getRegistrationDraft()?.password).toBe('test-only');clearRegistrationDraft();expect(getRegistrationDraft()).toBeUndefined();});
});
