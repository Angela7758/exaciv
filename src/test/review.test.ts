import {describe,it,expect} from 'vitest';
import {DEMO_MISTAKES,filterMistakes,examFrontier,collectMistakes} from '@/lib/review';
describe('review and navigation rules',()=>{
it('keeps six coherent demo mistakes separate from actual sessions',()=>{expect(DEMO_MISTAKES).toHaveLength(6);expect(collectMistakes([])).toEqual([]);expect(DEMO_MISTAKES.every(r=>r.selected!==r.question.answer)).toBe(true);});
it('finds laïcité without requiring accents',()=>expect(filterMistakes(DEMO_MISTAKES,'laicite','all','review')).toHaveLength(1));
it('filters by theme',()=>expect(filterMistakes(DEMO_MISTAKES,'','France et Europe','review')).toHaveLength(2));
it('filters mastered questions',()=>expect(filterMistakes(DEMO_MISTAKES.map((r,i)=>({...r,mastered:i===0})),'','all','mastered')).toHaveLength(1));
it('only unlocks question twelve after eleven contiguous answers',()=>{const a=Object.fromEntries(Array.from({length:11},(_,i)=>[String(i),1]));expect(examFrontier(a,40)).toBe(11);expect(examFrontier({...a,'15':1},40)).toBe(11);});
});