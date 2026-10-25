import {describe,it,expect} from 'vitest';
import {pathwayCoverage,applicableLessons,completedApplicable} from '@/lib/catalogue-coverage';
describe('Couverture réelle par parcours',()=>{
 it('garde les cinq thèmes et ne compte pas une classification non relue',()=>{
  const coverage=pathwayCoverage([{theme:'Institutions',exam_theme:null,pathways:['naturalisation'],question_type:'scenario',classification_reviewed_at:null}],'naturalisation');
  expect(coverage).toHaveLength(5);
  expect(coverage.find(t=>t.topic==='Système institutionnel et politique')).toMatchObject({total:1,scenario:0,knowledge:0});
  expect(coverage.find(t=>t.topic==='Vivre dans la société française')?.total).toBe(0);
  expect(pathwayCoverage([{theme:'Institutions',exam_theme:null,pathways:['naturalisation'],question_type:'knowledge',classification_reviewed_at:'2026-10-25'}],'resident').every(t=>t.total===0)).toBe(true);
 });
 it('exclut les anciens acquis non applicables sans les supprimer',()=>{
  const lessons=applicableLessons([{id:'a',pathways:['resident']},{id:'b',pathways:['naturalisation']}],'resident');
  const history=[{lesson_id:'a'},{lesson_id:'b'}];
  expect(completedApplicable(lessons,history)).toBe(1);
  expect(history).toHaveLength(2);
 });
});