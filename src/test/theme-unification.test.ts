import {describe,it,expect} from 'vitest';
import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import {OFFICIAL_TOPICS} from '@/config/official-programme';
import {EXAM_THEMES,TOPICS,emptyQuestion,questionSchema} from '@/lib/admin/schema';
import {validateImport,defaultMapping,IMPORT_FIELDS} from '@/lib/admin/import';
import {questionLiveState,lessonLiveState,type LiveQuestion} from '@/lib/admin/live-status';
const DIR=join(__dirname,'../../drizzle/migrations');
const OFFICIAL:string[]=OFFICIAL_TOPICS.map(t=>t.title);
const LEGACY=['Institutions','Valeurs de la République','Histoire','France et Europe'];
const files=readdirSync(DIR).filter(f=>f.endsWith('.sql')).sort();
const live=(f:string)=>readFileSync(join(DIR,f),'utf8').split('\n').filter(l=>!l.trimStart().startsWith('--')).join('\n');
function latestDefinition(name:string){let body='';for(const f of files){const sql=live(f);const re=new RegExp(`CREATE\\s+(?:OR\\s+REPLACE\\s+)?FUNCTION\\s+(?:public\\.)?${name}\\s*\\([\\s\\S]*?\\$(function)?\\$([\\s\\S]*?)\\$(function)?\\$`,'gi');for(const m of sql.matchAll(re))body=m[2]??'';}return body;}
const migration=readFileSync(join(DIR,files.find(f=>f.includes('unify_official_question_themes'))??''),'utf8');
const q={...emptyQuestion,id:'theme-test',question:'Qui vote les lois en France ?',options:[{id:'a',text:'Le Parlement'},{id:'b',text:'Le maire'},{id:'c',text:'Le préfet'},{id:'d',text:'Le juge'}],correct_option_id:'a',explanation:'Le Parlement vote les lois.',source:'Service-Public',source_url:'https://www.service-public.fr/'};
describe('Unification des thèmes officiels',()=>{
 it('the migration mapping has 41 unique ids and only official names',()=>{const block=migration.split('INSERT INTO theme_map(id,official) VALUES')[1]?.split(';')[0]??'';const rows=[...block.matchAll(/\('([^']+)','([^']+)'\)/g)];expect(rows.length).toBe(41);expect(new Set(rows.map(r=>r[1])).size).toBe(41);expect(rows.every(r=>OFFICIAL.includes(r[2]??''))).toBe(true);});
 it('EXAM_THEMES and TOPICS equal the official titles',()=>{expect([...EXAM_THEMES]).toEqual(OFFICIAL);expect(TOPICS).toEqual(OFFICIAL);});
 it('latest admin_validate_question accepts only the five official names',()=>{const body=latestDefinition('admin_validate_question');for(const t of OFFICIAL)expect(body).toContain(`'${t}'`);for(const t of LEGACY)expect(body).not.toContain(`'${t}'`);});
 it('latest exam composition partitions by the five official names',()=>{const body=latestDefinition('start_learning_session');const exam=body.slice(body.indexOf("IF p_kind='exam' THEN\n"));for(const t of OFFICIAL)expect(exam).toContain(`'${t}'`);expect(exam).toContain('PARTITION BY exam_theme');expect(exam).toContain('rn<=8');});
 it('the question form refuses a save without a theme',()=>{expect(emptyQuestion.theme).toBe('');expect(questionSchema.safeParse(q).success).toBe(false);const t=OFFICIAL[4]??'';expect(questionSchema.safeParse({...q,theme:t,exam_theme:t}).success).toBe(true);});
 it('refuses a theme different from exam_theme',()=>expect(questionSchema.safeParse({...q,theme:OFFICIAL[0],exam_theme:OFFICIAL[1]}).success).toBe(false));
 it('import rejects a legacy label and accepts the five official names',()=>{const map=defaultMapping([...IMPORT_FIELDS]);expect(validateImport([{...q,theme:'Institutions',exam_theme:'Institutions'}],map,[])[0]?.status).toBe('error');for(const t of OFFICIAL)expect(validateImport([{...q,id:'x',theme:t,exam_theme:t}],map,[])[0]?.status).toBe('new');});
 it('live badge: online, offline, unpublished changes, none',()=>{const t=OFFICIAL[1]??'';const payload={...q,theme:t,exam_theme:t,pathways:['naturalisation','resident','sejour']};const row:LiveQuestion={id:'theme-test',published:true,question:q.question,options:q.options.map(o=>o.text),option_ids:q.options.map(o=>o.id),correct_option_id:'a',explanation:q.explanation,theme:t,exam_theme:t,pathways:['naturalisation','resident','sejour'],source:q.source,source_url:q.source_url,lesson_id:null,question_type:'unclassified',classification_source:''};expect(questionLiveState(payload,row)).toEqual({badge:'En ligne',unpublished:false});expect(questionLiveState({...payload,explanation:'Autre explication'},{...row,published:false})).toEqual({badge:'Hors ligne',unpublished:true});expect(questionLiveState(payload,null)).toEqual({badge:null,unpublished:false});expect(lessonLiveState({},null).badge).toBeNull();});
});
