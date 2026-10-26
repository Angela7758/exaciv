import {describe,it,expect,vi} from 'vitest';
import {editorialLessonLayout,lastLessonSection,completeThenPractice} from '@/lib/lesson-reader';
describe('Continuous lesson rules',()=>{
 it('does not invent blocks for an absent layout',()=>expect(editorialLessonLayout(null)).toBeNull());
 it('keeps the supplied objectives pillars and example without rewriting',()=>{const layout={objectives:['Comprendre les trois principes de la devise.'],pillars:[{key:'liberte',title:'Liberté',text:'Texte éditorial'}],example:{title:'Exemple',text:'Texte'}};expect(editorialLessonLayout(layout)).toEqual(layout);});
 it('records the final body index at the takeaway, including a one-section lesson',()=>{expect(lastLessonSection(['un','deux','trois'])).toBe(2);expect(lastLessonSection(['un'])).toBe(0);expect(lastLessonSection([])).toBeNull();});
 it('completes successfully before opening lesson practice',async()=>{const order:string[]=[];expect(await completeThenPractice(async()=>{order.push('complete');},async()=>{order.push('practice');return 'lesson-session';})).toBe('lesson-session');expect(order).toEqual(['complete','practice']);});
 it('never starts practice when server completion is refused',async()=>{const start=vi.fn();await expect(completeThenPractice(async()=>{throw new Error('Lisez toutes les sections');},start)).rejects.toThrow('Lisez toutes les sections');expect(start).not.toHaveBeenCalled();});
});