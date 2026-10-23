import type {LearningSession} from './sessions';
export const PRACTICE_THEMES=[{title:'Institutions françaises',themes:['Institutions','Institutions françaises'],tone:'orange'},{title:'Valeurs de la République',themes:['Valeurs de la République','Principes et valeurs'],tone:'blue'},{title:'Droits et devoirs',themes:['Droits et devoirs'],tone:'green'}] as const;
export function practiceSuccessToday(sessions:LearningSession[],parcours:string,now=new Date()){
 const day=now.toLocaleDateString('en-CA',{timeZone:'Europe/Paris'});
 return sessions.filter(s=>s.parcours===parcours&&s.kind==='practice'&&s.completed_at&&new Date(s.completed_at).toLocaleDateString('en-CA',{timeZone:'Europe/Paris'})===day).reduce((n,s)=>n+(s.correct??0),0);
}
export function unfinishedSession(sessions:LearningSession[],parcours:string,kind:'practice'|'exam') {return sessions.find(s=>s.parcours===parcours&&s.kind===kind&&!s.completed_at&&!s.test_id);}