import {describe,it,expect} from 'vitest';
import {preparationDestination,selectedPlan} from '@/lib/preparation-navigation';
import {EXAM_FACTS} from '@/config/public-preparation';
import {PLANS,PAYMENTS_ENABLED} from '@/config/pricing';
describe('preparation navigation',()=>{
 it('rejects external destinations',()=>{expect(preparationDestination('https://example.org')).toBe('/app');expect(preparationDestination('//example.org')).toBe('/app');});
 it('retains each of the four method destinations',()=>{for(const path of ['/app/lecons','/app/entrainement','/app/mes-erreurs','/app/examen-blanc'])expect(preparationDestination(path)).toBe(path);});
 it('keeps Pass Révision separate from Essentiel',()=>{expect(PLANS.find(p=>p.id===selectedPlan('pass'))?.price).toBe('24,90 €');expect(PLANS.find(p=>p.id===selectedPlan('essentiel'))?.price).toBe('9,90 €');});
 it('does not activate payment',()=>expect(PAYMENTS_ENABLED).toBe(false));
 it.each(['naturalisation','resident','sejour'] as const)('%s uses verified format with separate conditions',track=>{expect(EXAM_FACTS[track].questions).toBe(40);expect(EXAM_FACTS[track].minutes).toBe(45);expect(EXAM_FACTS[track].minimum).toBe(32);});
});
