import {z} from 'zod';
import {questionTypeSchema} from '@/lib/practice-rules';
import {OFFICIAL_TOPICS} from '@/config/official-programme';
export const ADMIN_ROLES=['admin','editor','reviewer','operations'] as const;
// The five official themes are the only values accepted for new writes; legacy labels stay readable via officialTopic().
export const EXAM_THEMES=OFFICIAL_TOPICS.map(t=>t.title) as readonly string[];
export const TOPICS=[...EXAM_THEMES];
const officialTheme=z.string().refine(v=>EXAM_THEMES.includes(v),'Thème officiel requis (un des cinq thèmes officiels)');
export const PATHWAYS=['naturalisation','resident','sejour'] as const;
export function can(roles:string[],permission:string){return roles.includes('admin')||(roles.includes('editor')&&['content','edit'].includes(permission))||(roles.includes('reviewer')&&['content','publish'].includes(permission))||(roles.includes('operations')&&['users','reports'].includes(permission));}
export const questionSchema=z.object({id:z.string().regex(/^[A-Za-z0-9_-]{1,100}$/),question:z.string().trim().min(8).max(4000),options:z.array(z.object({id:z.string().min(1).max(100),text:z.string().trim().min(1).max(2000)})).length(4),correct_option_id:z.string(),explanation:z.string().trim().min(8).max(8000),theme:officialTheme,exam_theme:officialTheme,pathways:z.array(z.enum(PATHWAYS)).min(1),question_type:questionTypeSchema.default('unclassified'),classification_source:z.string().default(''),difficulty:z.enum(['easy','standard','hard']),source:z.string().max(1000),source_url:z.string().url().or(z.literal('')),lesson_id:z.string().default(''),image_url:z.string().url().or(z.literal('')).default(''),translations:z.record(z.enum(['zh','en','ar','es','ru']),z.object({question:z.string().min(1),options:z.record(z.string(),z.string().min(1)),explanation:z.string().optional()})).default({})}).superRefine((q,c)=>{if(q.question_type!=='unclassified'&&!q.classification_source.trim())c.addIssue({code:'custom',message:'Justification fiable de classification requise',path:['classification_source']});if(q.theme!==q.exam_theme)c.addIssue({code:'custom',message:'Le thème et le thème d’examen doivent être identiques',path:['exam_theme']});const ids=q.options.map(o=>o.id);if(new Set(ids).size!==4)c.addIssue({code:'custom',message:'Identifiants des options dupliqués',path:['options']});if(!ids.includes(q.correct_option_id))c.addIssue({code:'custom',message:'Bonne réponse absente des options',path:['correct_option_id']});for(const [locale,t] of Object.entries(q.translations)){if(Object.keys(t.options).length!==4||ids.some(id=>!t.options[id]))c.addIssue({code:'custom',message:`Options traduites non alignées (${locale})`,path:['translations',locale]});}});
export type AdminQuestion=z.infer<typeof questionSchema>;
export const emptyQuestion:AdminQuestion={id:'',question:'',options:['a','b','c','d'].map(id=>({id,text:''})),correct_option_id:'a',explanation:'',theme:'',exam_theme:'',pathways:[...PATHWAYS],question_type:'unclassified',classification_source:'',difficulty:'standard',source:'',source_url:'',lesson_id:'',image_url:'',translations:{}};
export interface Draft {id:string;payload:AdminQuestion;status:string;revision:number;updated_at:string;live?:import('./live-status').LiveQuestion|null|undefined;}
export interface TestConfig {question_type:'all'|'knowledge'|'scenario'|'unclassified';id:string;title:string;kind:'free'|'theme'|'practice'|'review'|'exam';pathways:string[];themes:string[];question_count:number;duration_minutes:number;selection:'fixed'|'rules';question_ids:string[];instant_feedback:boolean;allow_aids:boolean;status:string;revision:number;}
export const emptyTest:TestConfig={question_type:'all',id:'',title:'',kind:'practice',pathways:[...PATHWAYS],themes:[],question_count:10,duration_minutes:0,selection:'rules',question_ids:[],instant_feedback:true,allow_aids:true,status:'draft',revision:1};
export const statusLabel:Record<string,string>={draft:'Brouillon',pending:'À vérifier',verified:'Vérifié',published:'Publié',offline:'Retiré',reviewed:'Relu',open:'Ouvert',assigned:'Attribué',closed:'Fermé'};
export const lessonLayoutSchema=z.object({objectives:z.array(z.string().trim().min(1)),pillars:z.array(z.object({key:z.string().min(1),title:z.string().min(1),text:z.string().min(1)})),example:z.object({title:z.string().min(1),text:z.string().min(1)})}).strict().nullable();

const FIELD_LABELS:Record<string,string>={id:'ID stable',question:'Question en français',options:'Options',correct_option_id:'Bonne réponse',explanation:'Explication française',theme:'Thème officiel',exam_theme:'Thème officiel',pathways:'Parcours',question_type:'Type de question',classification_source:'Justification de classification',difficulty:'Difficulté',source:'Source',source_url:'Adresse de la source officielle',lesson_id:'Leçon associée',image_url:'Image',translations:'Traductions'};
export interface FieldIssue{field:string;label:string;message:string}
/** Converts validation issues into French, field-scoped messages; `field` matches the editor's data-field attribute. */
export function questionIssues(issues:z.ZodIssue[]):FieldIssue[]{
 const out:FieldIssue[]=[];
 for(const i of issues){
  const [root,index,sub]=i.path;const key=String(root??'');
  const field=key==='options'&&typeof index==='number'?`options.${index}.${String(sub??'text')}`:key==='exam_theme'?'theme':key;
  let label=FIELD_LABELS[key]??'Formulaire';
  if(key==='options'&&typeof index==='number')label=`Option ${index+1} · ${sub==='id'?'identifiant':'texte'}`;
  let message=i.message;
  if(i.code==='too_small')message=i.type==='array'?(key==='pathways'?'Sélectionnez au moins un parcours.':`Au moins ${i.minimum} élément(s) requis.`):Number(i.minimum)<=1?'Champ obligatoire.':`Au moins ${i.minimum} caractères requis.`;
  else if(i.code==='too_big')message=i.type==='array'?`Au plus ${i.maximum} éléments.`:`Au plus ${i.maximum} caractères.`;
  else if(i.code==='invalid_string')message=i.validation==='url'?'Adresse web complète requise (https://…), ou laissez vide.':'Lettres sans accents, chiffres, « - » ou « _ » uniquement (100 caractères maximum).';
  else if(i.code==='invalid_union')message=key==='source_url'||key==='image_url'?'Adresse web complète requise (https://…), ou laissez vide.':'Valeur non valide.';
  else if(i.code==='invalid_enum_value'||i.code==='invalid_type')message='Valeur non valide.';
  else if(!/[.!?)]$/.test(message))message+='.';
  if(!out.some(o=>o.field===field&&o.message===message))out.push({field,label,message});
 }
 return out;
}
