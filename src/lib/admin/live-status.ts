// Compares an admin draft with the live catalogue row (read-only; never changes a status).
export interface LiveQuestion {id:string;published:boolean;question:string;options:string[];option_ids:string[];correct_option_id:string|null;explanation:string;theme:string;exam_theme:string|null;pathways:string[];source:string;source_url:string|null;lesson_id:string|null;question_type:string;classification_source:string;}
export interface LiveLesson {id:string;published:boolean;title:string;topic:string;body:string[];takeaway:string[];minutes:number;source_url:string|null;}
export interface LiveState {badge:'En ligne'|'Hors ligne'|null;unpublished:boolean;}
const same=(a:unknown,b:unknown)=>JSON.stringify(a??null)===JSON.stringify(b??null);
const blank=(v:unknown)=>v===''||v===undefined?null:v;
export function questionLiveState(payload:Record<string,unknown>,live:LiveQuestion|null|undefined):LiveState{
 if(!live)return {badge:null,unpublished:false};
 const options=Array.isArray(payload['options'])?(payload['options'] as {id:string;text:string}[]):[];
 const diff=!same(payload['question'],live.question)||!same(options.map(o=>o.text),live.options)||!same(options.map(o=>o.id),live.option_ids)||!same(payload['correct_option_id'],live.correct_option_id)||!same(payload['explanation'],live.explanation)||!same(payload['theme'],live.theme)||!same(payload['exam_theme'],live.exam_theme)||!same([...((payload['pathways'] as string[]|undefined)??[])].sort(),[...live.pathways].sort())||!same(payload['source'],live.source)||!same(blank(payload['source_url']),blank(live.source_url))||!same(blank(payload['lesson_id']),blank(live.lesson_id))||!same(payload['question_type']??'unclassified',live.question_type)||!same(payload['classification_source']??'',live.classification_source);
 return {badge:live.published?'En ligne':'Hors ligne',unpublished:diff};
}
export function lessonLiveState(payload:Record<string,unknown>,live:LiveLesson|null|undefined):LiveState{
 if(!live)return {badge:null,unpublished:false};
 const diff=!same(payload['title'],live.title)||!same(payload['topic'],live.topic)||!same(payload['body'],live.body)||!same(payload['takeaway'],live.takeaway)||!same(payload['minutes'],live.minutes)||!same(blank(payload['source_url']),blank(live.source_url));
 return {badge:live.published?'En ligne':'Hors ligne',unpublished:diff};
}
