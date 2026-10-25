import {describe,it,expect} from 'vitest';
import {concealedReviewQuestion,reviewNavigation} from '@/lib/review-presentation';
import {reviewBatch} from '@/lib/review';
describe('page 3 review rules',()=>{
 const q={id:'q',theme:'Institutions',question:'Question',options:['a','b'],answer:1,correct_option_id:'b',explanation:'Secret',source:'Source',source_url:'https://example.com'};
 it('omits every correction field before validation',()=>{const safe=concealedReviewQuestion(q);expect(safe).toEqual({id:'q',theme:'Institutions',question:'Question',options:['a','b']});expect('answer' in safe).toBe(false);});
 it('caps pending mistakes at ten',()=>expect(reviewBatch(Array.from({length:12},(_,i)=>({key:String(i),question:q,selected:0,mastered:false})))).toHaveLength(10));
 it('skip moves only the view frontier',()=>expect(reviewNavigation(0,10)).toBe(1));
 it('last skip reaches the end without another question',()=>expect(reviewNavigation(9,10)).toBe(10));
});