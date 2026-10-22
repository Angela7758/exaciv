export const LOCALES = [{id:'fr',label:'Français',dir:'ltr'}, {id:'zh',label:'中文',dir:'ltr'}, {id:'en',label:'English',dir:'ltr'}, {id:'ar',label:'العربية',dir:'rtl'}, {id:'es',label:'Español',dir:'ltr'}, {id:'ru',label:'Русский',dir:'ltr'}] as const;
export const INTERFACE_LOCALES = LOCALES.filter(l=>l.id==='fr');
export const MAP_STAGES = ['Découvrir','Comprendre','S’entraîner','Corriger','Être prêt'];
import {OFFICIAL_TOPICS} from './official-programme';
export const TOPICS = OFFICIAL_TOPICS;
export function percentage(done:number,total:number) { return total > 0 ? Math.round(Math.min(done,total)/total*100) : 0; }
export function progressState(position:number,completed:number) { return position < completed ? 'done' : position === completed ? 'current' : 'locked'; }
export function canValidate(answer:number|null,submitted:boolean) { return answer !== null && !submitted; }
export function earnedXp(completions:{lesson_id:string;xp:number}[]) { return [...new Map(completions.map(c=>[c.lesson_id,c])).values()].reduce((n,c)=>n+c.xp,0); }
export function streakDays(dates:string[],now=new Date()) {
 const keys=new Set(dates.map(d=>new Date(d).toLocaleDateString('en-CA',{timeZone:'Europe/Paris'})));
 const day=new Date(now); if(!keys.has(day.toLocaleDateString('en-CA',{timeZone:'Europe/Paris'}))) day.setDate(day.getDate()-1);
 let count=0; while(keys.has(day.toLocaleDateString('en-CA',{timeZone:'Europe/Paris'}))) {count++; day.setDate(day.getDate()-1);} return count;
}
