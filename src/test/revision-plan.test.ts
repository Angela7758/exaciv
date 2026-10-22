import {describe,it,expect} from 'vitest';
import {revisionInput,revisionPlanSchema,safeGatewayError} from '../lib/revision-plan';
describe('personal revision input',()=>{
 it('accepts a learner-entered wrong answer as text',()=>expect(revisionInput.parse({mistakes:[{question:'Qui vote les lois ?',response:'Le Gouvernement'}],minutes:15}).mistakes[0]?.response).toBe('Le Gouvernement'));
 it('rejects empty error submissions',()=>expect(revisionInput.safeParse({mistakes:[],minutes:15}).success).toBe(false));
 it('rejects excessive input',()=>expect(revisionInput.safeParse({mistakes:Array.from({length:21},()=>({question:'Question',response:'Réponse'})),minutes:15}).success).toBe(false));
 it('rejects missing daily budget',()=>expect(revisionInput.safeParse({mistakes:[{question:'Question',response:'Réponse'}]}).success).toBe(false));
 it('requires concrete daily activities',()=>expect(revisionPlanSchema.safeParse({summary:'Résumé',priorities:['Institutions'],days:[{title:'Rappel'}]}).success).toBe(false));
 it('preserves terminal upstream safe messages',()=>expect(safeGatewayError(403,JSON.stringify({error:{message:'AI disabled by workspace admin'}}))).toBe('AI disabled by workspace admin'));
});