import {describe,it,expect} from 'vitest';
import {canValidatePractice,nextPracticeView,practiceQuestionState} from '@/lib/practice-navigation';
import {bookmarkInput,markedMistakes} from '@/lib/bookmarks';
import {sessionSchema} from '@/lib/sessions';
import {lessonLayoutSchema} from '@/lib/admin/schema';
const s=sessionSchema.parse({id:'session',kind:'practice',parcours:'naturalisation',lesson_id:null,questions:Array.from({length:10},(_,i)=>({id:String(i),theme:'Droits et devoirs',question:'Question',options:['a','b','c','d'],answer:0,explanation:'Explication',source:''})),answers:{'0':1},current_index:1,total:10,correct:null,started_at:'2026-10-25T18:00:00Z',deadline:null,completed_at:null});
describe('Practice view navigation without scoring',()=>{
 it('skips forward without changing any recorded answer or server index',()=>{expect(nextPracticeView(1,10)).toBe(2);expect(s.answers).toEqual({'0':1});expect(s.current_index).toBe(1);});
 it('does not run beyond the last question',()=>expect(nextPracticeView(9,10)).toBe(9));
 it('only validates the unanswered authoritative current question with a valid choice',()=>{expect(canValidatePractice(s,1,2)).toBe(true);expect(canValidatePractice(s,2,2)).toBe(false);expect(canValidatePractice(s,0,1)).toBe(false);expect(canValidatePractice(s,1,null)).toBe(false);expect(canValidatePractice(s,1,4)).toBe(false);});
 it('keeps local draft and recorded validation distinct',()=>{expect(practiceQuestionState(s,0,null)).toBe('validated');expect(practiceQuestionState(s,1,2)).toBe('saved');expect(practiceQuestionState(s,2,null)).toBe('todo');expect(practiceQuestionState(s,2,8)).toBe('todo');});
});
describe('Bookmark scope and lesson layout',()=>{
 it('accepts only question and lesson markers',()=>{expect(bookmarkInput.safeParse({kind:'question',itemId:'1',active:true}).success).toBe(true);expect(bookmarkInput.safeParse({kind:'lesson',itemId:'1',active:false}).success).toBe(true);expect(bookmarkInput.safeParse({kind:'account',itemId:'1',active:true}).success).toBe(false);});
 it('shows only questions marked by the supplied owner list',()=>{expect(markedMistakes([{key:'1'},{key:'2'}],[{kind:'question',item_id:'2',created_at:''},{kind:'lesson',item_id:'1',created_at:''}])).toEqual([{key:'2'}]);});
 it('accepts an absent editorial layout but rejects invalid objective data',()=>{expect(lessonLayoutSchema.safeParse(null).success).toBe(true);expect(lessonLayoutSchema.safeParse({objectives:[7],pillars:[],example:{title:'Title',text:'Text'}}).success).toBe(false);});
});
