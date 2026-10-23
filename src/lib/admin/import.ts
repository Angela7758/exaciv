import Papa from 'papaparse';
import {questionSchema,type AdminQuestion,type Draft} from './schema';
export const IMPORT_FIELDS=['id','question','options','correct_option_id','explanation','theme','exam_theme','pathways','difficulty','source','source_url','lesson_id','image_url','translations'] as const;
export type ImportField=typeof IMPORT_FIELDS[number];
export type ImportRow=Record<string,unknown>;
export interface ImportPreview {row:number;id:string;payload:AdminQuestion|null;errors:string[];status:'new'|'update'|'duplicate'|'error';revision:number;changes:string[];}
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
 const obj:Record<string,unknown>={};for(const f of IMPORT_FIELDS)obj[f]=row[mapping[f]??''];obj['options']=parseValue(obj['options'],[]);obj['translations']=parseValue(obj['translations'],{});obj['pathways']=parseValue(obj['pathways'],[]);if(typeof obj['pathways']==='string')obj['pathways']=obj['pathways'].split(/[|;,]/).map(s=>s.trim());for(const f of ['source','source_url','lesson_id','image_url'])obj[f]??='';obj['difficulty']=obj['difficulty']||'standard';
 const r=questionSchema.safeParse(obj);const id=String(obj['id']??'');const stem=normalize(String(obj['question']??''));const errors=r.success?[]:r.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`);if(seenId.has(id))errors.push('ID répété dans ce fichier');if(seenText.has(stem))errors.push('Texte répété dans ce fichier');seenId.add(id);seenText.add(stem);if(existing.some(d=>d.id!==id&&normalize(d.payload.question)===stem))errors.push('Ce texte existe avec un autre ID');const prev=existing.find(d=>d.id===id);const changes=r.success&&prev?IMPORT_FIELDS.filter(f=>JSON.stringify(prev.payload[f])!==JSON.stringify(r.data[f])):[];
 return {row:index+2,id,payload:r.success?r.data:null,errors,status:errors.length?'error':!prev?'new':changes.length?'update':'duplicate',revision:prev?.revision??0,changes};
 });}
export function csvTemplate(){return Papa.unparse({fields:[...IMPORT_FIELDS],data:[]});}
export function downloadText(name:string,text:string,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
