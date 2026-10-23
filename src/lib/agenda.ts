import {z} from 'zod';
export function dateKey(date:Date,timeZone:string){return new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
export function localDate(key:string){return new Date(`${key}T12:00:00`);}
export function shiftDate(key:string,days:number){const d=localDate(key);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function weekDates(selected:string){const day=localDate(selected).getDay();const first=shiftDate(selected,-((day+6)%7));return Array.from({length:7},(_,i)=>shiftDate(first,i));}
export function userTimezone(){return Intl.DateTimeFormat().resolvedOptions().timeZone||'Europe/Paris';}
export const agendaSchema=z.object({id:z.string().uuid().optional(),title:z.string().trim().min(1).max(180),kind:z.enum(['lesson','practice','exam','revision']),lesson_id:z.string().nullable(),test_id:z.string().uuid().nullable(),scheduled_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{const d=new Date(`${v}T12:00:00Z`);return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===v;},'Date invalide'),scheduled_time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).nullable(),timezone:z.string().refine(v=>{try{new Intl.DateTimeFormat('fr',{timeZone:v});return true;}catch{return false;}},'Fuseau horaire invalide'),duration_minutes:z.number().int().min(1).max(480),completed:z.boolean()});
export function dailyActivity(d:{completions:{completed_at:string}[];sessions:{id:string;kind:string;started_at:string;completed_at:string|null;answers?:unknown}[];attempts:{created_at:string;total:number}[]},key:string,timezone:string){
 const lessons=d.completions.filter(x=>dateKey(new Date(x.completed_at),timezone)===key).length;
 const sessions=d.sessions.filter(x=>x.completed_at&&dateKey(new Date(x.completed_at),timezone)===key);
 const attempts=d.attempts.filter(x=>dateKey(new Date(x.created_at),timezone)===key);
 const questions=sessions.reduce((n,s)=>n+Object.values(s.answers??{}).filter(a=>typeof a==='number'&&Number.isInteger(a)&&a>=0).length,0)+attempts.reduce((n,a)=>n+a.total,0);
 const exams=sessions.filter(s=>s.kind==='exam').length;
 const minutes=sessions.reduce((n,s)=>n+Math.max(0,(new Date(s.completed_at??s.started_at).getTime()-new Date(s.started_at).getTime())/60000),0);
 return {lessons,questions,exams,minutes:Math.round(minutes),activities:lessons+sessions.length+attempts.length};
}