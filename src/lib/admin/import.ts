import Papa from 'papaparse';
import {questionSchema,EXAM_THEMES,PATHWAYS,type AdminQuestion,type Draft} from './schema';
export const IMPORT_FIELDS=['id','question','options','correct_option_id','explanation','theme','exam_theme','pathways','difficulty','question_type','classification_source','source','source_url','lesson_id','image_url','translations'] as const;
export type ImportField=typeof IMPORT_FIELDS[number];
export type ImportRow=Record<string,unknown>;
export interface ImportPreview {row:number;id:string;payload:AdminQuestion|null;errors:string[];status:'new'|'update'|'duplicate'|'error';revision:number;changes:ImportField[];}
export function parseImport(text:string,filename:string):{rows:ImportRow[];columns:string[]}{
 let rows:ImportRow[];
 if(filename.toLowerCase().endsWith('.json')){const value:unknown=JSON.parse(text);if(!Array.isArray(value)||value.some(v=>!v||typeof v!=='object'||Array.isArray(v)))throw new Error('Le JSON doit contenir une liste de questions.');rows=value as ImportRow[];}
 else{const result=Papa.parse<ImportRow>(text,{header:true,skipEmptyLines:'greedy',transformHeader:h=>h.trim().replace(/^\uFEFF/,'')});if(result.errors.length)throw new Error(result.errors.map(e=>e.message).join(' ; '));rows=result.data;}
 if(rows.length===0||rows.length>500)throw new Error('Le fichier doit contenir entre 1 et 500 questions.');
 return {rows,columns:[...new Set(rows.flatMap(r=>Object.keys(r)))]};
}
export function defaultMapping(columns:string[]):Record<ImportField,string>{return Object.fromEntries(IMPORT_FIELDS.map(f=>[f,columns.includes(f)?f:''])) as Record<ImportField,string>;}
const normalize=(s:string)=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/\s+/g,' ').trim();
function parseValue(value:unknown,fallback:unknown){if(value===undefined||value==='')return fallback;if(typeof value==='string'){try{return JSON.parse(value);}catch{return value;}}return value;}
export function validateImport(rows:ImportRow[],mapping:Record<ImportField,string>,existing:Draft[]):ImportPreview[]{const seenId=new Set<string>();const seenText=new Set<string>();return rows.map((row,index)=>{
 const obj:Record<string,unknown>={};for(const f of IMPORT_FIELDS)obj[f]=mapping[f]?row[mapping[f]]:undefined;const previous=existing.find(d=>d.id===String(obj['id']??''));for(const f of ['question_type','classification_source'] as const){if(!mapping[f]&&previous)obj[f]=previous.payload[f];}obj['options']=parseValue(obj['options'],[]);obj['translations']=parseValue(obj['translations'],{});obj['pathways']=parseValue(obj['pathways'],[]);if(typeof obj['pathways']==='string')obj['pathways']=obj['pathways'].split(/[|;,]/).map(s=>s.trim());for(const f of ['source','source_url','lesson_id','image_url'])obj[f]??='';if(!obj['exam_theme']&&obj['theme'])obj['exam_theme']=obj['theme'];if(!obj['theme']&&obj['exam_theme'])obj['theme']=obj['exam_theme'];obj['difficulty']=obj['difficulty']||'standard';obj['question_type']=obj['question_type']||'unclassified';obj['classification_source']=obj['classification_source']||'';
 const r=questionSchema.safeParse(obj);const id=String(obj['id']??'');const stem=normalize(String(obj['question']??''));const errors=r.success?[]:r.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`);if(seenId.has(id))errors.push('ID répété dans ce fichier');if(seenText.has(stem))errors.push('Texte répété dans ce fichier');seenId.add(id);seenText.add(stem);if(existing.some(d=>d.id!==id&&normalize(d.payload.question)===stem))errors.push('Ce texte existe avec un autre ID');const prev=existing.find(d=>d.id===id);const changes=r.success&&prev?IMPORT_FIELDS.filter(f=>JSON.stringify(prev.payload[f])!==JSON.stringify(r.data[f])):[];
 return {row:index+2,id,payload:r.success?r.data:null,errors,status:errors.length?'error':!prev?'new':changes.length?'update':'duplicate',revision:prev?.revision??0,changes};
 });}
export const IMPORT_THEMES=[...EXAM_THEMES];
export const IMPORT_PATHWAYS=PATHWAYS.join('|');
const exampleTheme=EXAM_THEMES[1]??'';
export const IMPORT_EXAMPLE={id:'exemple-1',question:'Qui vote les lois en France ?',options:[{id:'a',text:'Le Parlement'},{id:'b',text:'Le maire'},{id:'c',text:'Le préfet'},{id:'d',text:'Le juge'}],correct_option_id:'a',explanation:'Le Parlement vote les lois.',theme:exampleTheme,exam_theme:exampleTheme,pathways:[...PATHWAYS],difficulty:'standard',question_type:'unclassified',classification_source:'',source:'Service-Public',source_url:'https://www.service-public.fr/',lesson_id:'',image_url:'',translations:{}};
export function csvExample(){const e=IMPORT_EXAMPLE;return Papa.unparse({fields:[...IMPORT_FIELDS],data:[[e.id,e.question,JSON.stringify(e.options),e.correct_option_id,e.explanation,e.theme,e.exam_theme,IMPORT_PATHWAYS,e.difficulty,e.question_type,e.classification_source,e.source,e.source_url,e.lesson_id,e.image_url,'{}']]});}
export function csvTemplate(){return csvExample();}
export function downloadText(name:string,text:string,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}

// ============= Simplified CSV template (section 3) =============
export const SIMPLE_FIELDS=['question','option_a','option_b','option_c','option_d','bonne_reponse','explication','theme','pathways','difficulte','source','source_url'] as const;
export type SimpleField=typeof SIMPLE_FIELDS[number];
const strip=(s:string)=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
// Case- and accent-insensitive header synonyms for both the full and the simple template.
export const HEADER_SYNONYMS:Record<string,string[]>={
 id:['id','identifiant','identifiant_stable','question_id'],
 question:['question','texte','intitule','enonce','question_fr'],
 options:['options','choix','reponses_json'],
 correct_option_id:['correct_option_id','bonne_reponse_id','reponse_id','correct'],
 explanation:['explication','correction','explication_fr'],
 theme:['theme','theme_officiel','thematique','categorie'],
 exam_theme:['exam_theme','theme_examen'],
 pathways:['pathways','parcours','parcours_concernes'],
 difficulty:['difficulty','difficulte','niveau'],
 question_type:['question_type','type','type_de_question'],
 classification_source:['classification_source','justification','justification_classification'],
 source:['source','nom_source','reference'],
 source_url:['source_url','url_source','lien_source','lien'],
 lesson_id:['lesson_id','lecon','lecon_id','cours_id'],
 image_url:['image_url','image','illustration'],
 translations:['translations','traductions'],
 option_a:['option_a','optiona','reponse_a','a'],
 option_b:['option_b','optionb','reponse_b','b'],
 option_c:['option_c','optionc','reponse_c','c'],
 option_d:['option_d','optiond','reponse_d','d'],
 bonne_reponse:['bonne_reponse','bonne_reponse_lettre','reponse_correcte','answer'],
 explication:['explication','explication_simple'],
};
export function synonymMapping(columns:string[]):Record<ImportField,string>{
 const byNorm=new Map(columns.map(c=>[strip(c),c]));
 return Object.fromEntries(IMPORT_FIELDS.map(f=>{
  const hit=[f,...(HEADER_SYNONYMS[f]??[])].map(s=>strip(s)).find(s=>byNorm.has(s));
  return [f,hit?byNorm.get(hit)!:''];
 })) as Record<ImportField,string>;
}
export function detectSimpleMapping(columns:string[]):Record<SimpleField,string>|null{
 const byNorm=new Map(columns.map(c=>[strip(c),c]));
 const out:Record<string,string>={};
 for(const f of SIMPLE_FIELDS){const hit=(HEADER_SYNONYMS[f]??[f]).map(s=>strip(s)).find(s=>byNorm.has(s));if(!hit)return null;out[f]=byNorm.get(hit)!;}
 return out as Record<SimpleField,string>;
}
export const isSimpleColumns=(columns:string[])=>detectSimpleMapping(columns)!==null;
function stableImportId(question:string,index:number):string{
 const slug=question.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
 return `import-${slug||'question'}-${index+1}`;
}
// Convert one simple-template row into a full import row (generated option ids a–d).
export function simpleRowToImportRow(row:ImportRow,mapping:Record<SimpleField,string>,index:number):ImportRow{
 const get=(f:SimpleField)=>String(row[mapping[f]]??'').trim();
 const letter=get('bonne_reponse').toUpperCase();
 const options=['A','B','C','D'].map(l=>({id:l.toLowerCase(),text:get(('option_'+l.toLowerCase()) as SimpleField)}));
 return {
  id:stableImportId(get('question'),index),question:get('question'),
  options:JSON.stringify(options),correct_option_id:['A','B','C','D'].includes(letter)?letter.toLowerCase():letter,
  explanation:get('explication'),theme:get('theme'),exam_theme:get('theme'),pathways:get('pathways')||IMPORT_PATHWAYS,
  difficulty:get('difficulte')||'standard',source:get('source'),source_url:get('source_url'),
 };
}
export function simpleRowsToImportRows(rows:ImportRow[],columns:string[]):{rows:ImportRow[];mapping:Record<SimpleField,string>}|null{
 const mapping=detectSimpleMapping(columns);if(!mapping)return null;
 return {rows:rows.map((r,i)=>simpleRowToImportRow(r,mapping,i)),mapping};
}
export function csvSimpleTemplate(){
 return Papa.unparse({fields:[...SIMPLE_FIELDS],data:[['Qui vote les lois en France ?','Le Parlement','Le maire','Le préfet','Le juge','A','Le Parlement vote les lois.',EXAM_THEMES[1]??'','naturalisation|resident|sejour','standard','Service-Public','https://www.service-public.fr/']]});
}
// Export of the current drafts using exactly IMPORT_FIELDS (section 3).
export function draftsToCsv(drafts:Draft[]):string{
 return Papa.unparse({fields:[...IMPORT_FIELDS],data:drafts.map(d=>IMPORT_FIELDS.map(f=>{
  const v=(d.payload as Record<string,unknown>)[f];
  return typeof v==='object'&&v!==null?JSON.stringify(v):(v??'');
 }))});
}
export function draftsToJson(drafts:Draft[]):string{return JSON.stringify(drafts.map(d=>d.payload),null,2);}
// Row-level validation report, downloadable as CSV (row, id, reasons).
export function errorReportCsv(preview:ImportPreview[]):string{
 return Papa.unparse({fields:['ligne','id','statut','raisons'],data:preview.map(r=>[r.row,r.id,r.status,r.errors.join(' | ')])});
}
