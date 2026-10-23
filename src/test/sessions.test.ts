import {describe,it,expect} from 'vitest';
import {feedbackState,sessionSummary,durationMinutes,sessionSchema} from '@/lib/sessions';
const make=(correct:number)=>({total:40,questions:Array.from({length:40},(_,i)=>({id:String(i),theme:['Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe'][Math.floor(i/8)]??'',question:'q',options:['A','B','C','D'],answer:0,explanation:'',source:''})),answers:Object.fromEntries(Array.from({length:40},(_,i)=>[String(i),i<correct?0:1]))});
describe('persistent session rules',()=>{
 it('preserves the configured five-minute duration in a frozen session',()=>{const result=sessionSchema.parse({...make(1),id:'configured',kind:'exam',parcours:'naturalisation',lesson_id:null,current_index:0,correct:0,started_at:'2026-10-23T10:00:00Z',deadline:'2026-10-23T10:05:00Z',completed_at:null,test_id:'test',test_rules:{title:'Test',allow_aids:false,instant_feedback:false,duration_minutes:5}});expect(result.test_rules?.duration_minutes).toBe(5);});
 it('keeps Government as actual wrong choice and Parliament as correct',()=>expect([0,1,2,3].map(i=>feedbackState(1,0,i))).toEqual(['correct','incorrect','neutral','neutral']));
 it('34 correct of 40 means 85 percent and six errors',()=>expect(sessionSummary(make(34))).toMatchObject({correct:34,total:40,percent:85,wrong:6,achieved:true}));
 it('the five reference theme scores sum to 34 of 40',()=>{const s=make(40);const scores=[8,7,7,6,6];s.answers=Object.fromEntries(s.questions.map((q,i)=>[String(i),i%8<(scores[Math.floor(i/8)]??0)?q.answer:1]));expect(sessionSummary(s)).toMatchObject({correct:34,total:40,percent:85,wrong:6,themes:{Institutions:{correct:8,total:8},'Valeurs de la République':{correct:7,total:8},Histoire:{correct:7,total:8},'Droits et devoirs':{correct:6,total:8},'France et Europe':{correct:6,total:8}}});});
 it('does not claim objective reached below 32 of 40',()=>expect(sessionSummary(make(31)).achieved).toBe(false));
 it('32 of 40 reaches the practice objective',()=>expect(sessionSummary(make(32)).achieved).toBe(true));
 it('derives 38 minutes from stored timestamps',()=>expect(durationMinutes('2026-10-22T12:00:00Z','2026-10-22T12:38:00Z')).toBe(38));
 it('counts unsubmitted answers as errors, not as correct answers',()=>expect(sessionSummary({...make(40),answers:{}}).wrong).toBe(40));
});
