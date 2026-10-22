import {describe,it,expect} from 'vitest';
import {practiceSuccessToday,unfinishedSession} from '@/lib/practice-entry';
import type {LearningSession} from '@/lib/sessions';
const session=(overrides:Partial<LearningSession>):LearningSession=>({id:'s',kind:'practice',parcours:'naturalisation',lesson_id:null,questions:[],answers:{},current_index:0,total:10,correct:8,started_at:'2026-10-22T08:00:00Z',deadline:null,completed_at:'2026-10-22T08:05:00Z',...overrides});
describe('practice entry real metrics',()=>{
 it('counts 24 practice successes separately from a 34/40 exam',()=>{const rows=[session({}),session({}),session({}),session({kind:'exam',correct:34,total:40}),session({parcours:'resident'}),session({completed_at:'2026-10-21T08:00:00Z'})];expect(practiceSuccessToday(rows,'naturalisation',new Date('2026-10-22T14:00:00Z'))).toBe(24);});
 it('resumes only an unfinished session of the same kind and pathway',()=>{const rows=[session({kind:'exam',completed_at:null,id:'exam'}),session({completed_at:null,parcours:'resident',id:'other'}),session({completed_at:null,id:'practice'})];expect(unfinishedSession(rows,'naturalisation','practice')?.id).toBe('practice');expect(unfinishedSession(rows,'naturalisation','exam')?.id).toBe('exam');});
});