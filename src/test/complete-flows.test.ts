import {describe,it,expect} from 'vitest';
import {collectMistakes} from '@/lib/review';
import {consentedDiagnostic,objectiveSchema} from '@/lib/registration';
import {INTERFACE_LOCALES} from '@/config/learning';
import {sessionSummary,type LearningSession} from '@/lib/sessions';
const question={id:'law',theme:'Institutions',question:'Qui vote ?',options:['Parlement','Autre'],answer:0,explanation:'',source:''};
function session(answer:number,date:string):LearningSession{return {id:date,kind:'practice',parcours:'naturalisation',lesson_id:null,questions:[question],answers:{'0':answer},current_index:0,total:1,correct:answer===0?1:0,started_at:date,completed_at:date,deadline:null};}
describe('complete learning flows',()=>{
 it('retains historical mistakes after a later correct answer and marks mastered',()=>{const rows=collectMistakes([session(1,'2026-10-01'),session(0,'2026-10-02')]);expect(rows).toHaveLength(1);expect(rows[0]?.selected).toBe(1);expect(rows[0]?.mastered).toBe(true);});
 it('a later wrong answer returns a historical mistake to pending',()=>expect(collectMistakes([session(0,'2026-10-01'),session(1,'2026-10-02')])[0]?.mastered).toBe(false));
 it('never associates a guest result without explicit consent',()=>{expect(consentedDiagnostic(JSON.stringify(Array(10).fill(0)))).toBeNull();expect(consentedDiagnostic(JSON.stringify({key:'c22336fb-9f24-4545-8090-0b278dc3d9d9',ids:Array(10).fill('q'),answers:Array(10).fill(0),consent:false}))).toBeNull();});
 it('accepts an explicitly consented ten-answer test with stable ids',()=>{const result=consentedDiagnostic(JSON.stringify({key:'c22336fb-9f24-4545-8090-0b278dc3d9d9',ids:Array.from({length:10},(_,i)=>`q${i}`),answers:Array(10).fill(0),consent:true}));expect(result?.ids).toHaveLength(10);expect(result?.consent).toBe(true);});
 it('exposes six interface languages while retaining stored Portuguese compatibility',()=>{expect(INTERFACE_LOCALES.map(l=>l.id)).toEqual(['fr','zh','en','ar','es','ru']);expect(objectiveSchema.safeParse({parcours:'resident',locale:'pt',goal_date:null}).success).toBe(true);expect(objectiveSchema.safeParse({parcours:'resident',locale:'de',goal_date:null}).success).toBe(false);});
 it('submitted unanswered exam questions stay separate from wrong answers',()=>expect(sessionSummary({questions:[question,question],answers:{'0':0},total:2})).toMatchObject({correct:1,total:2,wrong:0,unanswered:1,percent:50}));
});
