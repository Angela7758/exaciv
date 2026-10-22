import {describe,it,expect} from 'vitest';
import {feedbackState,sessionSummary,durationMinutes} from '@/lib/sessions';
const make=(correct:number)=>({total:40,questions:Array.from({length:40},(_,i)=>({id:String(i),theme:['Institutions','Valeurs de la République','Histoire','Droits et devoirs','France et Europe'][Math.floor(i/8)]??'',question:'q',options:['A','B','C','D'],answer:0,explanation:'',source:''})),answers:Object.fromEntries(Array.from({length:40},(_,i)=>[String(i),i<correct?0:1]))});
describe('persistent session rules',()=>{
 it('keeps Government as actual wrong choice and Parliament as correct',()=>expect([0,1,2,3].map(i=>feedbackState(1,0,i))).toEqual(['correct','incorrect','neutral','neutral']));
 it('34 correct of 40 means 85 percent and six errors',()=>expect(sessionSummary(make(34))).toMatchObject({correct:34,total:40,percent:85,wrong:6,achieved:true}));
 it('does not claim objective reached below 32 of 40',()=>expect(sessionSummary(make(31)).achieved).toBe(false));
 it('32 of 40 reaches the practice objective',()=>expect(sessionSummary(make(32)).achieved).toBe(true));
 it('derives 38 minutes from stored timestamps',()=>expect(durationMinutes('2026-10-22T12:00:00Z','2026-10-22T12:38:00Z')).toBe(38));
 it('counts unsubmitted answers as errors, not as correct answers',()=>expect(sessionSummary({...make(40),answers:{}}).wrong).toBe(40));
});
