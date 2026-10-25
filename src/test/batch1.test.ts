import {describe,it,expect} from 'vitest';
import {hasRecordedAnswers,sessionSummary,type LearningSession} from '@/lib/sessions';
import {collectMistakes,reviewBatch,filterMistakes} from '@/lib/review';
import {effectivePracticeCount,learnerQuestionTypes} from '@/lib/practice-rules';
const q={id:'q',theme:'France et Europe',question:'Qui vote ?',options:['A','B'],answer:0,explanation:'Explication',source:''};
const session:LearningSession={id:'s',kind:'exam',parcours:'naturalisation',lesson_id:null,questions:[q,{...q,id:'q2'},{...q,id:'q3'}],answers:{'0':0,'1':1},current_index:0,total:3,correct:1,started_at:'2026-10-25',deadline:null,completed_at:'2026-10-25'};
describe('Lot 1 — règles de données',()=>{
 it('ignores empty sessions in mistakes for every kind',()=>{for(const kind of ['exam','practice','review','diagnostic'])expect(collectMistakes([{...session,kind,answers:{}}])).toEqual([]);});
 it('accepts option zero and rejects invalid keys, fractions and out-of-range answers',()=>{expect(hasRecordedAnswers(session)).toBe(true);for(const answers of [{99:0},{0:-1},{0:2},{0:0.5}])expect(hasRecordedAnswers({...session,answers})).toBe(false);});
 it('separates one wrong answer from one unanswered question',()=>{const rows=collectMistakes([session]);expect(sessionSummary(session)).toMatchObject({wrong:1,unanswered:1});expect(filterMistakes(rows,'','all','review').map(r=>r.key)).toEqual(['q2']);expect(filterMistakes(rows,'','all','unanswered').map(r=>r.key)).toEqual(['q3']);});
 it('caps revision at ten newest pending wrong answers',()=>{const rows=Array.from({length:15},(_,i)=>({...q,key:String(i),question:{...q,id:String(i)},selected:1,mastered:false}));expect(reviewBatch(rows).map(r=>r.key)).toEqual(['0','1','2','3','4','5','6','7','8','9']);expect(reviewBatch([{key:'blank',question:q,selected:-1,mastered:false,unanswered:true},...rows.slice(1)])).toHaveLength(10);});
 it('orders review mistakes by most recent completed session',()=>{const older={...session,questions:[q],answers:{0:1},started_at:'2026-10-01',completed_at:'2026-10-01'};const newer={...older,questions:[{...q,id:'new'}],completed_at:'2026-10-26'};expect(collectMistakes([older,newer]).map(r=>r.key)).toEqual(['new','q']);});
 it.each([[10,8,8],[20,9,9],[5,3,3],[5,1,1],[10,0,0],[5,20,5]] as const)('clamps requested %s to available %s = %s',(request,available,result)=>expect(effectivePracticeCount(request,available)).toBe(result));
 it('hides learner types when no reviewed classifications exist',()=>expect(learnerQuestionTypes([{knowledge:0,scenario:0}])).toEqual([]));
 it('only exposes three learner types and disables an empty classification',()=>expect(learnerQuestionTypes([{knowledge:2,scenario:0}])).toEqual([{id:'all',disabled:false},{id:'knowledge',disabled:false},{id:'scenario',disabled:true}]));
 it('preserves uncertain legacy topic labels but prefers exact official exam themes',()=>{expect(collectMistakes([{...session,questions:[q],answers:{0:1}}])[0]?.question.theme).toBe('France et Europe');expect(collectMistakes([{...session,questions:[{...q,exam_theme:'Droits et devoirs'}],answers:{0:1}}])[0]?.question.theme).toBe('Droits et devoirs');});
});