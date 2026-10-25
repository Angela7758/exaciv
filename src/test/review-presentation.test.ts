import {describe,it,expect} from 'vitest';
import {concealedReviewQuestion,reviewNavigation} from '@/lib/review-presentation';
import {reviewBatch} from '@/lib/review';
import {plural,resultNavigation} from '@/lib/learner-labels';
describe('page 2 targeted rules',()=>{
 it('zero and one use French singular',()=>{expect(plural(0,'bonne réponse','bonnes réponses')).toBe('bonne réponse');expect(plural(1,'réponse incorrecte','réponses incorrectes')).toBe('réponse incorrecte');expect(plural(2,'bonne réponse','bonnes réponses')).toBe('bonnes réponses');});
 it.each([['practice',10],['review',1],['exam',1],['exam',39]])('short %s result activates training', (kind,total)=>expect(resultNavigation({kind:String(kind),total:Number(total)})).toBe('/app/entrainement'));
 it('only 40 question exam activates exam',()=>expect(resultNavigation({kind:'exam',total:40})).toBe('/app/examen-blanc'));
});
describe('page 3 review rules',()=>{
 const q={id:'q',theme:'Institutions',question:'Question',options:['a','b'],answer:1,correct_option_id:'b',explanation:'Secret',source:'Source',source_url:'https://example.com'};
 it('omits every correction field before validation',()=>{const safe=concealedReviewQuestion(q);expect(safe).toEqual({id:'q',theme:'Institutions',question:'Question',options:['a','b']});expect('answer' in safe).toBe(false);});
 it('caps pending mistakes at ten',()=>expect(reviewBatch(Array.from({length:12},(_,i)=>({key:String(i),question:q,selected:0,mastered:false})))).toHaveLength(10));
 it('skip moves only the view frontier',()=>expect(reviewNavigation(0,10)).toBe(1));
 it('last skip reaches the end without another question',()=>expect(reviewNavigation(9,10)).toBe(10));
});