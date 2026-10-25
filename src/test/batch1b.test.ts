import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {LEGACY_TOPIC_MAP,officialTopic} from '@/config/official-programme';
import {PRACTICE_THEMES} from '@/lib/practice-entry';
import {plural,sessionLabel,readingProgress} from '@/lib/learner-labels';
import {sessionSummary} from '@/lib/sessions';
const q={id:'q',theme:'Histoire et symboles',question:'q',options:['A','B'],answer:1,explanation:'',source:''};
describe('batch 1b theme contract',()=>{
 it.each(['Valeurs de la République','Principes et valeurs','Histoire et symboles','Institutions','Institutions françaises','Droits et devoirs','Histoire','France et Europe','Vie en société','Société française'])('groups legacy %s in its official practice theme',label=>{
  const groups=PRACTICE_THEMES.filter(t=>t.themes.includes(label));
  expect(groups).toHaveLength(1);expect(groups[0]?.title).toBe(officialTopic(label));
 });
 it('matches every label in the latest civic_topic SQL definition',()=>{
  const definitions=readdirSync('drizzle/migrations').filter(f=>f.endsWith('.sql')).sort().flatMap(f=>[...readFileSync(`drizzle/migrations/${f}`,'utf8').matchAll(/CREATE OR REPLACE FUNCTION public\.civic_topic\b[\s\S]*?\$\$([\s\S]*?)\$\$/gi)]);
  const sql=definitions.at(-1)?.[1];expect(sql).toBeDefined();
  const table:Record<string,string>={};
  for(const branch of (sql??'').matchAll(/WHEN p_theme(?:\s+IN\s*\(([^)]+)\)|\s*=\s*('(?:[^']|'')*'))\s+THEN\s+'((?:[^']|'')*)'/gi)){
   for(const label of (branch[1]??branch[2]??'').matchAll(/'((?:[^']|'')*)'/g))table[(label[1]??'').replaceAll("''","'")]=(branch[3]??'').replaceAll("''","'");
  }
  expect(Object.keys(table).length).toBe(14);
  for(const [label,topic] of Object.entries(LEGACY_TOPIC_MAP))expect(table[label]).toBe(topic);
  for(const [label,topic] of Object.entries(table))expect(officialTopic(label)).toBe(topic);
 });
 it('uses frozen exam_theme first and merges historical aliases in summaries',()=>{
  expect(sessionSummary({questions:[q,{...q,id:'b',theme:'France et Europe'}],answers:{'0':0,'1':1},total:2}).themes).toEqual({'Histoire, géographie et culture':{correct:1,total:2}});
  expect(sessionSummary({questions:[{...q,exam_theme:'Institutions'}],answers:{'0':1},total:1}).themes).toEqual({'Système institutionnel et politique':{correct:1,total:1}});
 });
});
describe('batch 1b session labels',()=>{
 it.each([['exam',40,'Examen blanc · 0/40'],['exam',1,'Test court · 0/1'],['review',1,'Révision · 0/1'],['practice',5,'Entraînement · 0/5'],['diagnostic',10,'Diagnostic · 0/10']])('labels %s of %i truthfully',(kind,total,label)=>{
  expect(sessionLabel({kind:String(kind),total:Number(total),correct:0,questions:[q],answers:{'0':0}})).toBe(label);
 });
 it('keeps answerless sessions non evaluated',()=>expect(sessionLabel({kind:'exam',total:1,correct:0,questions:[q],answers:{}})).toBe('Test court · Non évalué'));
});
describe('batch 1b reading and plurals',()=>{
 it('shows half at section 1 of 2',()=>expect(readingProgress(0,2)).toBe(50));
 it('shows full at section 2 of 2',()=>expect(readingProgress(1,2)).toBe(100));
 it('keeps empty lessons at zero',()=>expect(readingProgress(0,0)).toBe(0));
 it.each([['jour','jours'],['question','questions'],['leçon','leçons'],['erreur','erreurs'],['session','sessions']])('selects singular %s for zero and one',(singular,multiple)=>{expect(plural(1,singular,multiple)).toBe(singular);expect(plural(0,singular,multiple)).toBe(singular);expect(plural(2,singular,multiple)).toBe(multiple);});
});