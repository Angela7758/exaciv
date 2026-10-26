import {describe,expect,it} from 'vitest';
import {emptyQuestion,questionIssues,questionSchema} from '@/lib/admin/schema';

const issuesFor=(patch:Record<string,unknown>)=>{const r=questionSchema.safeParse({...emptyQuestion,...patch});if(r.success)throw new Error('expected failure');return questionIssues(r.error.issues);};

describe('questionIssues',()=>{
 it('reports an empty new question field by field in French',()=>{
  const list=issuesFor({});
  const fields=list.map(i=>i.field);
  expect(fields).toEqual(expect.arrayContaining(['id','question','options.0.text','explanation','theme']));
  expect(list.find(i=>i.field==='question')?.message).toBe('Au moins 8 caractères requis.');
  expect(list.find(i=>i.field==='options.0.text')?.label).toBe('Option 1 · texte');
  expect(list.every(i=>!/String must|Invalid|Required/.test(i.message))).toBe(true);
 });
 it('names the pathway and URL fields',()=>{
  const list=issuesFor({pathways:[],source_url:'pas une url'});
  expect(list.find(i=>i.field==='pathways')?.message).toBe('Sélectionnez au moins un parcours.');
  expect(list.find(i=>i.field==='source_url')?.message).toContain('https://');
 });
});
