import {EXAM_THEMES} from './schema';

export interface LessonPillarForm {key:string;title:string;text:string;}
export interface LessonFormState {
 title:string;topic:string;minutes:number;objective:string;introduction:string;
 body:string[];takeaway:string[];source_url:string;
 layoutObjectives:string[];pillars:LessonPillarForm[];exampleTitle:string;exampleText:string;
 hero_media_id:string;hero_override:boolean;
}
export interface LessonPayload extends Record<string,unknown> {
 title?:string;topic?:string;minutes?:number;objective?:string;introduction?:string;
 body?:string[];takeaway?:string[];source_url?:string;
 layout?:{objectives:string[];pillars:{key:string;title:string;text:string}[];example:{title:string;text:string}}|null;
 hero_media_id?:string;hero_override?:boolean;
}

const textArray=(v:unknown):string[]=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'):[];

export function payloadToLessonForm(payload:LessonPayload):LessonFormState{
 const layout=payload.layout&&typeof payload.layout==='object'?payload.layout:null;
 return {
  title:payload.title??'',topic:payload.topic??'',minutes:payload.minutes??8,
  objective:payload.objective??'',introduction:payload.introduction??'',
  body:textArray(payload.body),takeaway:textArray(payload.takeaway),source_url:payload.source_url??'',
  layoutObjectives:textArray(layout?.objectives),
  pillars:(layout?.pillars??[]).map(p=>({key:p.key,title:p.title,text:p.text})),
  exampleTitle:layout?.example?.title??'',exampleText:layout?.example?.text??'',
  hero_media_id:payload.hero_media_id??'',hero_override:payload.hero_override===true,
 };
}

export function lessonFormToPayload(form:LessonFormState):LessonPayload{
 const hasLayout=form.layoutObjectives.some(v=>v.trim())||form.pillars.some(p=>p.title.trim()||p.text.trim())||form.exampleTitle.trim()||form.exampleText.trim();
 const payload:LessonPayload={
  title:form.title.trim(),topic:form.topic,minutes:form.minutes,
  objective:form.objective.trim(),introduction:form.introduction.trim(),
  body:form.body.map(v=>v.trim()).filter(Boolean),takeaway:form.takeaway.map(v=>v.trim()).filter(Boolean),
  source_url:form.source_url.trim(),
  layout:hasLayout?{
   objectives:form.layoutObjectives.map(v=>v.trim()).filter(Boolean),
   pillars:form.pillars.filter(p=>p.title.trim()&&p.text.trim()).map(p=>({key:p.key.trim()||p.title.trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9]+/g,'-'),title:p.title.trim(),text:p.text.trim()})),
   example:{title:form.exampleTitle.trim(),text:form.exampleText.trim()},
  }:null,
  hero_media_id:form.hero_media_id,hero_override:form.hero_override,
 };
 return payload;
}

// Same rules as manage_learning_lesson(save), plus the form-level checks.
export function validateLessonForm(form:LessonFormState):string[]{
 const errors:string[]=[];
 if(form.title.trim().length<5)errors.push('Le titre doit contenir au moins 5 caractères.');
 if(!EXAM_THEMES.includes(form.topic))errors.push('Choisissez l’un des cinq thèmes officiels.');
 if(!Number.isInteger(form.minutes)||form.minutes<1||form.minutes>120)errors.push('La durée doit être comprise entre 1 et 120 minutes.');
 const body=form.body.map(v=>v.trim()).filter(Boolean);
 if(!body.length)errors.push('Ajoutez au moins une section de cours.');
 if(body.some(v=>v.length<20))errors.push('Chaque section doit contenir au moins 20 caractères.');
 if(!form.takeaway.map(v=>v.trim()).filter(Boolean).length)errors.push('Ajoutez au moins un point « À retenir ».');
 if(form.source_url.trim()&&!/^https:\/\//.test(form.source_url.trim()))errors.push('L’adresse de la source doit commencer par https://');
 for(const p of form.pillars){if((p.title.trim()||p.text.trim())&&(!p.title.trim()||!p.text.trim()))errors.push('Chaque pilier doit avoir un titre et un texte.');}
 if((form.exampleTitle.trim()||form.exampleText.trim())&&(!form.exampleTitle.trim()||!form.exampleText.trim()))errors.push('L’exemple doit avoir un titre et un texte.');
 return errors;
}
