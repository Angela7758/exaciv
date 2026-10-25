import {describe,it,expect} from 'vitest';
import {practiceCountSchema,practiceInputSchema} from '@/lib/practice-rules';
describe('Règles de l’entrée entraînement',()=>{
 it.each([5,10,20])('accepte exactement %s questions',n=>expect(practiceCountSchema.parse(n)).toBe(n));
 it.each([6,9,15,'5','10',null,0,21])('refuse %s sans conversion ni réduction',n=>expect(practiceCountSchema.safeParse(n).success).toBe(false));
 it.each(['knowledge','scenario','unclassified'])('conserve le filtre %s',questionType=>expect(practiceInputSchema.parse({count:5,questionType}).questionType).toBe(questionType));
 it('refuse une classification inconnue',()=>expect(practiceInputSchema.safeParse({count:5,questionType:'guessed'}).success).toBe(false));
});